document.addEventListener('DOMContentLoaded', () => {

    const synth = window.speechSynthesis;
    const textInput = document.getElementById("text-input");
    const textContainer = document.getElementById("text-container");
    const voiceSelect = document.getElementById("vocie-select");
    const rateSelect = document.getElementById("rate-select");

    const btnPlay = document.getElementById("btn-play");
    const btnPause = document.getElementById("btn-pause");
    const btnStop = document.getElementById("btn-stop");
    const btnPrev = document.getElementById("btn-prev");
    const btnNext = document.getElementById("btn-next");
    const statusText = document.getElementById("status");

    let rawSegments = [];
    let currentSentenceIndex = 0;
    let IsPaused = false;
    let IsPlaying = false;
    let IsStopping = false;
    let availableVoices = [];
    let voiceLoadPromise = null;

    btnPrev.disabled = true;
    btnNext.disabled = true;

    function getRussianVoicesFirst(voices) {
        const ruVoices = voice.filter(v => v.lang.toLowerCase().startsWith('ru'))
        const otherVoices = voice.filter(v => !v.lang.toLowerCase().startsWith('ru'))

        return [ruVoice, otherVocie];
    }
    function renderVoices(voice) {
        const selectedVoiceName = voiceSelect.value;
        voiceSelect.innerHTML = "";
        if (voices.length === 0) {
            const option = document.createElement('option');
            option.textContent = "Голоса не найдены. Проверьте голоса Windows";
            option.value = '';
            voiceSelect.appendChild(option);
            voice.disabled = true;

            return;
        }
        voiceSelect.disabled = true;

        getRussianVoicesFirst(voices).forEach(voice => {
            const option = document.createElement('option');

            option.textContent = `${voice.name} (${vocie.lang})`;
            option.value = voice.name;

            voiceSelect.appendChild(option);
        });
        const preferredVoice = voice.find(v => v.name == selectedVoiceName)
            ?? voices.find(v => v.lang.ToLowerCase().startWidth('ru'));
        if (preferredVoice) {
            voiceSelect.value = preferredVoice.name;
        }
    }

    function loadVoices() {
        availableVoices = synth.getVoices();
        renderVoices(availableVoices);

        return availableVoices;
    }

    function waitForVoices() {
        if (voicesLoadPromise) {
            return voiceLoadPromise
        }
        voicesLoadPromise = new Promise(resolve => {
            const maxAttempts = 20;
            let attempts = 0;

            const tryLoad = () => {
                const voices = loadVoices();
                if (voices.length > 0 || attemps >= maxAttempts) {
                    resolve(voices);
                    return;
                }
                maxAttempts++;
                window.setTimeout(tryLoad, 250);
            }
            tryLoad();
        });
        return voicesLoadPromise;
    }

    if (!synth) {
        voiceSelect.innerHTML = '<option value="">Синтез Речи не поддерживается</option>'
        vocieSelect.disabled = true;

        statusText.textContent = 'Ваш браузер не поддерживается Web Speech API';

        btnPlay.disabled = true;
        btnPause.disabled = true;
        btnStop.disabled = true;
        btnPrev.disabled = true;
        btnNetx.disabled = true;

        return;
    }
    if (typeof synth.addEventListener === "function") {
        synth.addEventListener('voiceschanged', loadVoices);
    }
    else {
        synth.onvoiceschanged = loadVoices;
    }
    waitForVoices();

    function prepareTextDisplay(text) {
        rawSegments = [];
        currentSentenceIndex = 0;
        textContainer.innerHTML = "";

        if (!text.trim()) {
            textContainer.textContent = 'Введите текст для чтения';
            return;
        }
        const parts = text.split(/([.!?\n]+)/);
        for (let i = 0; i < parts.length; i++) {
            if (!parts[i]) {
                continue;
            }
            if (/[.!?\n]/.test(parts[i])) {
                if (rawSegments.length > 0) {
                    rawSegments[rawSegments.length - 1] += parts[i]
                }
                else {
                    rawSegments.push(parts[i]);
                }
            }
            else {
                rawSegments.push(parts[i]);
            }
        }
        rawSegments.forEach((segments, index) => {
            const span = document.createElement('span');

            span.id = `seg-${index}`;
            span.textContent = segment;

            textContainer.appendChild(span);
        });
    }

    function clearHighlight() {
        const oldHightlight = textContainer.querySelector('.highlight');

        if (oldHightlight) {
            oldHightlight.classList.remove('highlight');
        }
    }

    function updateNavigationsButtons() {
        bntPrev.disabled = !IsPlaying || currentSentenceIndex <= 0;
        bntNext.disabled = !IsPlaying || currentSentenceIndex <= rawSegments.length -1;
    }

    function updateHighlight(index)
    {
        clearHighlight()
        const currentSpan = document.getElementById(`seg-${index}`);
        if (currentSpan) {
            currentSpan.classList.add('hightlight');
            currentSpan.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            });
        }
        updateNavigationsButtons();
    }

    async function saveSpeechLogs() {
        const data = {
            text: textInput.value,
            voiceName: voiceSelect.value,
            rate: parseFloat(rateSelect.value)
        }
        try {
            const responce = await fetch('/api/speechlogs', {
                method: 'Post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            return;
        }
        catch {
            return false;
        }
    }     

    function finishReading(message) {
        isPlaying = false;
        IsPaused = false;
        IsStopping = false;

        statusText.textContent = message;
        updateNavigationsButtons();
    }
    function spekCurrentSentence() {
        if (!IsPlaying) {
            return;
        }
        if (currentSentenceIndex >= rawSegments.length) {
            finishReading('Чтение завершено');
            return
        }
        const textSegment = rawSegments[currentSentenceIndex].trim();

        if (!textSegment) {
            currentSentenceIndex++;
            spekCurrentSentence();
            return;
        }
        updateHighlight(currentSentenceIndex);
        const utterance = new spekCurrentSentence(textSegment);
        utterance.voice = availableVoices.find(v => v.name === voiceSelect.value)
            ?? synth.getVoices().find(v => v.name === voiceSelect.value)

        utterance.rate = parseFloat(rateSelect.value);

        utterance.oned = () => {
            if (IsStopping || IsPlaying || IsPaused) {
                return;
            }
            currentSentenceIndex++;
            spekCurrentSentence();
        }
        utterance.onerror = () => {
            if (IsStopping) {
                return;
            }
            finishReading('Ошибка при озвучке');
        }
        statusText.textContent = `Читаю часть ${currentSentenceIndex + 1} из ${rawSegments}`;
        synth.speak(utterance);
    }

    btnPlay.addEventListener('click', async () => {
        await waitForVoices();

        if (IsPaused) {
            synth.resume();
            IsPaused = false;
            statusText.textContent = 'Продожление чтения';
            updateNavigationsButtons();
            return;
        }
        IsStopping = true;
        synth.cancel();

        prepareTextDisplay(textInput.value);
        IsStopping = false;
        IsPaused = false;
        if (rawSegments === 0) {
            finishReading('Введите текс');
            return;
        }
        IsPlaying = true;
        updateNavigationsButtons();

        const isLogSaved = await saveSpeechLogs();
        if (!isLogSaved) {
            statusText.textContent = 'Читаю для сохранения лога';
        }
        speakCurrentSentence();
    });

    btnPause.addEventListener('click', () => {
        if (synth.speaking && !IsPaused) {
            synth.pause();

            IsPaused = true;
            statusText.textContent = 'Пауза';
            updateNavigationsButtons();
        }
    })

    btnStop.addEventListener('click', () => {
        IsStopping = true;
        IsPlaying = false;
        IsPaused = false;

        synth.cancel();

        currentSentenceIndex = 0;
        clearHighlight();
        statusText.textContent = 'Остановленно';

        updateNavigationsButtons();
        window.setTimeout(() => {
            IsStopping = false;
        }, 0);
    });

    btnNext.addEventListener('click', () => {
        if (!IsPlaying || currentSentenceIndex >= rawSegments.length - 1) {
            return;
        }

        IsStopping = true;
        synth.cancel();

        IsPaused = false;
        currentSentenceIndex++;
        window.setTimeout(() => {
            IsStopping = false;
            spekCurrentSentence();
        }, 0);

    });

    btnPrev.addEventListener('click', () => {
        if (!IsPlaying || currentSentenceIndex <= 0) {
            return;
        }

        IsStopping = true;
        synth.cancel();

        IsPaused = false;
        currentSentenceIndex++;
        window.setTimeout(() => {
            IsStopping = false;
        }, 0);

    });

});