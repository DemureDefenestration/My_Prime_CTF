import React, { useState, useEffect, useRef } from 'react';
import './LandingPage.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const LandingPage = () => {
  // Картинки для лівої та правої сторін
  const leftImages = ['bezzub_1.png', 'bezzub_4.png'];
  const rightImages = ['kica_1.png', 'kica_4.png'];
  const audioRef = useRef(null);
  
  const [leftIndex, setLeftIndex] = useState(1); // Дефолт: bezzub_4.png
  const [rightIndex, setRightIndex] = useState(0); // Дефолт: kica_1.png
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [theme, setTheme] = useState('dark-red'); // default: dark-red
  const [volume, setVolume] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const emberCount = 40;
  const [Motion, setMotion] = useState(null);
  const emberSeedsRef = useRef(null);

  const ukrainianText = `Коли дракони злітають у цифрову ніч, навіть найтемніші куточки коду стають видимими. Я готова осідлати цей шторм пліч-о-пліч із Беззубиком та Кицею, щоб утримати вершину гори проти будь-якого падіння серверу.

Довгими вечорами, заварюючи терпкий еліксир Lovare без цукру, я вдивлялася у вогні політехніки, зважуючи свій шлях. Мій розум знаходив спокій лише у суворих канонах тихої літургії монашок, чий спів заспокоює шторм у моїй душі перед черговою атакою на сервер. Поруч зі мною завжди чатує Річард — мій вірний супутник. Нехай його зріст не вводить в оман: у грудях цього звіра б'ється серце розлюченого вовка, готового перегризти горлянку будь-якому багу чи загарбнику. Я — Віка Божик, зі столиці світу Івано-Франківськ, донька своєї матері, син свого батька, і я прийшла заявити свої права на цю висоту.`;

  // Typing/chunking state for modal text animation
  const [chunks, setChunks] = useState([]);
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const typingIntervalRef = useRef(null);
  const pauseTimeoutRef = useRef(null);

  // Prepare chunks when modal opens
  useEffect(() => {
    if (!isModalOpen) return;

    // Split text into sentences (keep punctuation)
    const sentences = ukrainianText.match(/[^.!?]+[.!?]+(?:\s|$)/g) || [ukrainianText];
    const groupSize = 2; // number of sentences per chunk
    const chks = [];
    for (let i = 0; i < sentences.length; i += groupSize) {
      chks.push(sentences.slice(i, i + groupSize).join(' ').trim());
    }

    setChunks(chks);
    setCurrentChunkIndex(0);
    setDisplayedText('');

    return () => {
      // cleanup if modal closed quickly
      clearInterval(typingIntervalRef.current);
      clearTimeout(pauseTimeoutRef.current);
      typingIntervalRef.current = null;
      pauseTimeoutRef.current = null;
    };
  }, [isModalOpen]);

  // Handle typing for the current chunk (codepoint-safe)
  useEffect(() => {
    if (!isModalOpen || chunks.length === 0) return;

    const chunk = chunks[currentChunkIndex] || '';
    const chars = Array.from(chunk); // safe for unicode codepoints
    let idx = 0;
    setDisplayedText('');

    // clear any prior timers
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;
    }
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
      pauseTimeoutRef.current = null;
    }

    typingIntervalRef.current = setInterval(() => {
      // set substring up to current char (avoids broken graphemes)
      setDisplayedText(chars.slice(0, idx + 1).join(''));
      idx += 1;

      if (idx >= chars.length) {
        clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;

        // after typing completes, wait 5s then move to next chunk (if any)
        if (currentChunkIndex + 1 < chunks.length) {
          pauseTimeoutRef.current = setTimeout(() => {
            setDisplayedText('');
            setCurrentChunkIndex((c) => c + 1);
          }, 5000);
        }
      }
    }, 25); // typing speed (ms per char)

    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;
      }
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current);
        pauseTimeoutRef.current = null;
      }
    };
  }, [currentChunkIndex, chunks, isModalOpen]);
  useEffect(() => {
    try { window.currentTheme = theme; } catch (e) { /* ignore if not in browser */ }
  }, [theme]);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.loop = true;
    audio.volume = volume;
    audio.muted = volume === 0;

    const playPromise = audio.play();

    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {
        // Autoplay can be blocked until the first user interaction.
      });
    }
  }, [volume]);

  useEffect(() => {
    let mounted = true;
    import('framer-motion')
      .then((mod) => {
        if (mounted && mod && mod.motion) setMotion(() => mod.motion);
      })
      .catch(() => {
        if (mounted) setMotion(null);
      });

    return () => {
      mounted = false;
    };
  }, []);

  // Generate ember seeds once on mount so they don't change on re-renders
  useEffect(() => {
    if (emberSeedsRef.current) return;

    const seeds = Array.from({ length: emberCount }).map(() => {
      const left = 10 + Math.random() * 80; // percent
      const top = 10 + Math.random() * 80; // percent
      const delay = Math.random() * 2; // stagger
      const duration = 3 + Math.random() * 6;
      const size = (8 + Math.random() * 28) / 1.5;
      const startOpacity = 0.4 + Math.random() * 0.6;
      const dx = (Math.random() - 0.5) * 300; // limited movement
      const dy = (Math.random() - 0.5) * 300; // limited movement
      const rot = -30 + Math.random() * 60;

      return { left, top, delay, duration, size, startOpacity, dx, dy, rot };
    });

    emberSeedsRef.current = seeds;
  }, [emberCount]);

  // Start independent Web Animations for fallback embers so animations
  // continue without being tied to React renders or user clicks.
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // small delay to ensure DOM nodes exist
    const t = setTimeout(() => {
      const els = document.querySelectorAll('.ember-fallback');

      els.forEach((el) => {
        const dx = parseFloat(el.getAttribute('data-dx')) || 0;
        const dy = parseFloat(el.getAttribute('data-dy')) || 0;
        const duration = (parseFloat(el.getAttribute('data-duration')) || 6) * 1000;
        const delay = (parseFloat(el.getAttribute('data-delay')) || 0) * 1000;
        const startOpacity = parseFloat(el.getAttribute('data-start-opacity')) || 0.5;

        // Use Web Animations API to animate transform + opacity independently
        try {
          el.animate(
            [
              { transform: 'translate(0px, 0px) scale(0.6)', opacity: 0 },
              { transform: `translate(${dx / 2}px, ${dy / 2}px) scale(0.95)`, opacity: startOpacity },
              { transform: `translate(${dx}px, ${dy}px) scale(1.05)`, opacity: 0 }
            ],
            {
              duration,
              delay,
              iterations: Infinity,
              easing: 'linear'
            }
          );
        } catch (e) {
          // if WAAPI not supported, fallback to CSS animation (already present)
        }
      });
    }, 50);

    return () => clearTimeout(t);
  }, []);

  const ensureAudioPlaying = () => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.loop = true;
    audio.volume = volume;
    audio.muted = volume === 0;

    if (audio.paused) {
      const playPromise = audio.play();

      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {
          // Ignore blocked autoplay; the next user gesture will resume it.
        });
      }
    }
  };

  const handleRightButtonClick = () => {
    ensureAudioPlaying();

    if (isTransitioning) return;
    if (theme === 'light-red') return;
    setIsTransitioning(true);
    
    const leftSequence = [1, 0];
    const rightSequence = [0, 1];
    let currentStep = 0;
    
    const interval = setInterval(() => {
      setLeftIndex(leftSequence[currentStep]);
      setRightIndex(rightSequence[currentStep]);
      
      if (currentStep === 1) {
        setTheme('light-red');
      }
      
      currentStep++;
      
      if (currentStep >= leftSequence.length) {
        clearInterval(interval);
        setIsTransitioning(false);
      }
    }, 100);
  };

  const handleLeftButtonClick = () => {
    ensureAudioPlaying();

    if (isTransitioning) return;
    if (theme === 'dark-red') return;
    setIsTransitioning(true);
    
    const leftSequence = [0, 1];
    const rightSequence = [1, 0];
    let currentStep = 0;
    
    const interval = setInterval(() => {
      setLeftIndex(leftSequence[currentStep]);
      setRightIndex(rightSequence[currentStep]);
      
      if (currentStep === 1) {
        setTheme('dark-red');
      }
      
      currentStep++;
      
      if (currentStep >= leftSequence.length) {
        clearInterval(interval);
        setIsTransitioning(false);
      }
    }, 100);
  };

  const handleVolumeChange = (event) => {
    const nextVolume = Number(event.target.value);
    setVolume(nextVolume);

    const audio = audioRef.current;

    if (audio) {
      audio.volume = nextVolume;
      audio.muted = nextVolume === 0;
      if (audio.paused) {
        audio.play().catch(() => {
          // Ignore blocked autoplay until the user interacts with the page.
        });
      }
    }
  };

  const handleLetterKClick = () => {
    setIsButtonClicked(true);
    setIsModalOpen(true);
    ensureAudioPlaying();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    // keep `isButtonClicked` true so the button stays as letterO after reading
  };

  const shouldShowRichard = isModalOpen && currentChunkIndex === 2;
  const highlightedPhrase = 'і я прийшла заявити свої права на цю висоту.';
  const hardSkills = [
    { label: 'htmlCss.png', text: 'HTML5, CSS3' },
    { label: 'docker.png', text: 'Docker' },
    { label: 'js.png', text: 'JavaScript' },
    { label: 'react.png', text: 'React' },
    { label: 'csharp.png', text: 'C#' },
    { label: 'mongoDB.png', text: 'MongoDb' },
    { label: 'nodejs.png', text: 'Node.js' },
    { label: 'mysql.png', text: 'MySQL' },
    { label: 'socketio.png', text: 'Socket.io' },
    { label: 'python.png', text: 'Python' }
  ];
  const terminalPrompt = 'PS E:\\My_Prime_CTF>';
  const terminalVariants = {
    why_me: [
      'Почну з такого факту – за 2 курси на ПЗ я жодного разу не прострочила дедлайн, навіть коли минулого семестру в нас було 40 лабораторних, 2 розрахункові і 1 курсова, я не тільки все встигала (також поїздки в гори та інші активності), а ще й залишилася на стипендії та піднялася в рейтингу. Тобто як би важко не було –  я зможу тримати дедлайни, а також допомагати іншим кортімівцям, адже команда це не про особистий успіх.',
      'Найбільше знання, яке мені подарувала моя спеціальність, – це навичка вчитися швидко, що, на мою думку, є важливим для будь-якої посади.',
      'Я не боюся брати відповідальність за свої вчинки, своє навчання, свого собаку. Раніше дуже багато ресурсу виділяла саме на університет, та тепер готова піти далі та взяти відповідальність за щось більше – за свою команду, та поставити її першим пріоритетом.',
      'Ознайомилася глибше зі своїми обов’язками та особливостями не тільки своєї посади, а й coreteam CTF загалом. Взяла KT в Андрія Родінчука, Єлизавети Ясінської та Романа Сікорського. Брала участь в coding night минулої осені, шкода, так мало тасок там було написано і ще менше використано, тож маю ідею як це покращити.',
      'Готова брати ініціативу в команді, допомагати своїм тімейтам: сіарити компанії, знімати відео, тримати платформу. Загалом хелпати задля спільного успіху та найкращого CTF!'
    ],
    why_ctf: [
      'Мені подобається розвиватися в програмуванні, тому найбільше в coreteam я розглядала саме цю посаду. Зараз мене почав більше цікавити Devops, і саме це виділяє CTF серед інших івентів. Адже тут посада IT не закінчується на написанні сайту, брошури та бота – цього року, посада на яку я подаюсь, також включає в себе допомогу контенту з підтримкою інфраструктури змагань. Це можливість для мене випробувати себе в цій сфері та вивчити щось нове.',
      'Ця coreteam припадає на літо. Для мене це чудовий спосіб його провести в стилі work hard – party harder. Також я повністю усвідомлюю, що найгарячіша її частина буде саме посеред навчального семестру, проте це тільки ще одна з причин подаватися – не обмежувати своє життя університетом.',
      'Досвід кортімівця унікальний, проте саме coreteam CTF мені найбільше подобається по духу, символіці та виду діяльності самого івенту. Також мене приваблює довгостроковість самої coreteam.'
    ]
  };
  const [terminalSuggestionVisible, setTerminalSuggestionVisible] = useState(false);
  const [terminalSelection, setTerminalSelection] = useState(null);
  const [terminalCompletedText, setTerminalCompletedText] = useState('');
  const [terminalCurrentText, setTerminalCurrentText] = useState('');
  const [terminalCanClear, setTerminalCanClear] = useState(false);
  const [terminalChunks, setTerminalChunks] = useState([]);
  const [terminalCurrentChunkIndex, setTerminalCurrentChunkIndex] = useState(0);
  const terminalTypingIntervalRef = useRef(null);
  const terminalPauseTimeoutRef = useRef(null);
  const terminalOutputEndRef = useRef(null);

  useEffect(() => {
    return () => {
      if (terminalTypingIntervalRef.current) {
        clearInterval(terminalTypingIntervalRef.current);
        terminalTypingIntervalRef.current = null;
      }
      if (terminalPauseTimeoutRef.current) {
        clearTimeout(terminalPauseTimeoutRef.current);
        terminalPauseTimeoutRef.current = null;
      }
    };
  }, []);

  // Prepare chunks when terminal selection changes
  useEffect(() => {
    if (!terminalSelection) return;

    const paragraphs = terminalVariants[terminalSelection] || [];
    // Join paragraphs with newlines to create continuous text
    const fullText = paragraphs.join('\n\n');
    
    // Split into chunks similar to modal (every paragraph + newlines)
    const chks = paragraphs.map(p => p + '\n\n');
    
    setTerminalChunks(chks);
    setTerminalCurrentChunkIndex(0);
    setTerminalCompletedText('');
    setTerminalCurrentText('');
    setTerminalCanClear(false);

    return () => {
      if (terminalTypingIntervalRef.current) {
        clearInterval(terminalTypingIntervalRef.current);
        terminalTypingIntervalRef.current = null;
      }
      if (terminalPauseTimeoutRef.current) {
        clearTimeout(terminalPauseTimeoutRef.current);
        terminalPauseTimeoutRef.current = null;
      }
    };
  }, [terminalSelection]);

  // Handle typing for the current chunk (similar to modal)
  useEffect(() => {
    if (!terminalSelection || terminalChunks.length === 0) return;

    const chunkText = terminalChunks[terminalCurrentChunkIndex] || '';
    const chars = Array.from(chunkText);
    let idx = 0;

    setTerminalCurrentText('');

    // clear any prior timers
    if (terminalTypingIntervalRef.current) {
      clearInterval(terminalTypingIntervalRef.current);
      terminalTypingIntervalRef.current = null;
    }
    if (terminalPauseTimeoutRef.current) {
      clearTimeout(terminalPauseTimeoutRef.current);
      terminalPauseTimeoutRef.current = null;
    }

    terminalTypingIntervalRef.current = setInterval(() => {
      setTerminalCurrentText(chars.slice(0, idx + 1).join(''));
      idx += 1;

      if (idx >= chars.length) {
        clearInterval(terminalTypingIntervalRef.current);
        terminalTypingIntervalRef.current = null;

        setTerminalCompletedText((prev) => prev + chunkText);
        setTerminalCurrentText('');

        // after typing completes, wait 2s then move to next chunk (if any)
        if (terminalCurrentChunkIndex + 1 < terminalChunks.length) {
          terminalPauseTimeoutRef.current = setTimeout(() => {
            setTerminalCurrentChunkIndex((c) => c + 1);
          }, 2000);
        } else {
          setTerminalCanClear(true);
        }
      }
    }, 25); // typing speed (ms per char)

    return () => {
      if (terminalTypingIntervalRef.current) {
        clearInterval(terminalTypingIntervalRef.current);
        terminalTypingIntervalRef.current = null;
      }
      if (terminalPauseTimeoutRef.current) {
        clearTimeout(terminalPauseTimeoutRef.current);
        terminalPauseTimeoutRef.current = null;
      }
    };
  }, [terminalCurrentChunkIndex, terminalChunks, terminalSelection]);

  useEffect(() => {
    if (!terminalSelection) return;

    const frameId = window.requestAnimationFrame(() => {
      const element = terminalOutputEndRef.current;
      if (!element) return;
        
      // Перевіряємо, чи елемент вже видимий на екрані
      const rect = element.getBoundingClientRect();
      const isVisible = rect.top >= 0 && rect.top < window.innerHeight;

      // Прокручуємо тільки якщо елемент знаходиться за межами видимості (внизу)
      if (!isVisible) {
        element.scrollIntoView({
          block: 'end',
          inline: 'nearest',
          behavior: 'auto'
        });
      }
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [terminalSelection, terminalCompletedText, terminalCurrentText, terminalCurrentChunkIndex, terminalCanClear, terminalSuggestionVisible]);

  // Прокручуємо в самий низ коли з'явиться кнопка очистити
  useEffect(() => {
    if (!terminalCanClear) return;

    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
  }, [terminalCanClear]);

  const handleShowSuggestion = () => {
    setTerminalSuggestionVisible(true);
  };

  const handleTerminalChoice = (choice) => {
    setTerminalSelection(choice);
    setTerminalSuggestionVisible(false);
  };

  const handleClearTerminal = () => {
    if (terminalTypingIntervalRef.current) {
      clearInterval(terminalTypingIntervalRef.current);
      terminalTypingIntervalRef.current = null;
    }
    if (terminalPauseTimeoutRef.current) {
      clearTimeout(terminalPauseTimeoutRef.current);
      terminalPauseTimeoutRef.current = null;
    }

    setTerminalSuggestionVisible(false);
    setTerminalSelection(null);
    setTerminalCompletedText('');
    setTerminalCurrentText('');
    setTerminalChunks([]);
    setTerminalCurrentChunkIndex(0);
    setTerminalCanClear(false);
  };

  const renderTypedText = () => {
    const exactPhraseIndex = displayedText.indexOf(highlightedPhrase);

    if (exactPhraseIndex !== -1) {
      return (
        <>
          {displayedText.slice(0, exactPhraseIndex)}
          <span className="typed-highlight">{highlightedPhrase}</span>
          {displayedText.slice(exactPhraseIndex + highlightedPhrase.length)}
        </>
      );
    }

    let overlapLength = 0;

    for (let len = Math.min(displayedText.length, highlightedPhrase.length); len > 0; len -= 1) {
      if (displayedText.slice(-len) === highlightedPhrase.slice(0, len)) {
        overlapLength = len;
        break;
      }
    }

    if (overlapLength === 0) {
      return displayedText;
    }

    return (
      <>
        {displayedText.slice(0, displayedText.length - overlapLength)}
        <span className="typed-highlight">{displayedText.slice(displayedText.length - overlapLength)}</span>
      </>
    );
  };

  return (
    <div className={`landing-container ${theme ? `theme-${theme}` : ''}`}>
      <div className="embers" aria-hidden="true">
        {(emberSeedsRef.current || Array.from({ length: emberCount })).map((seed, i) => {
          // if emberSeedsRef is not yet set, fallback to a small stable seed
          const s = emberSeedsRef.current ? seed : {
            left: 10 + Math.random() * 80,
            top: 10 + Math.random() * 80,
            delay: Math.random() * 2,
            duration: 6,
            size: (12) / 1.5,
            startOpacity: 0.6,
            dx: 0,
            dy: 0,
            rot: 0
          };

          const { left, top, delay, duration, size, startOpacity, dx, dy, rot } = s;

          if (Motion) {
            const MotionSpan = Motion.span;
            return (
              <MotionSpan
                key={i}
                className="ember"
                style={{ left: `${left}%`, top: `${top}%`, width: size, height: size, opacity: startOpacity, rotate: `${rot}deg` }}
                initial={{ x: 0, y: 0, opacity: 0, rotate: 0 }}
                animate={{ x: dx, y: dy, opacity: [0, startOpacity, 0], rotate: rot }}
                transition={{
                  duration: duration,
                  delay: delay,
                  repeat: Infinity,
                  repeatType: 'loop',
                  ease: 'linear'
                }}
              />
            );
          }

          return (
            <span
              key={i}
              className="ember ember-fallback"
              data-dx={dx}
              data-dy={dy}
              data-duration={duration}
              data-delay={delay}
              data-start-opacity={startOpacity}
              style={{
                left: `${left}%`,
                top: `${top}%`,
                width: `${size}px`,
                height: `${size}px`,
                opacity: startOpacity,
                ['--dx']: `${dx}px`,
                ['--dy']: `${dy}px`,
                ['--duration']: `${duration}s`,
                ['--delay']: `${delay}s`,
                ['--rot']: `${rot}deg`
              }}
            />
          );
        })}
      </div>
      <audio ref={audioRef} src="mus/GOT.mp3" autoPlay loop preload="auto" />
      {/* Header section with text and image */}
      <div className="header-section">
        <div className="text-container">
          <h1 className="main-text">Божик Вікторія</h1>
          <div className="contacts-list">
            <div className="contact-row">
              <img className="contact-icon" src="img/inst.png" alt="Instagram" style={{ borderRadius: '50%' }} />
              <a
                className="contact-nick"
                href="https://instagram.com/boberko_228"
                target="_blank"
                rel="noreferrer"
              >
                @boberko_228
              </a>
            </div>
            <div className="contact-row">
              <img className="contact-icon" src="img/tg.png" alt="Telegram" style={{ borderRadius: '50%' }} />
              <a
                className="contact-nick"
                href="https://t.me/Ididns"
                target="_blank"
                rel="noreferrer"
              >
                @Ididns
              </a>
            </div>
          </div>
        </div>
        <div className="image-placeholder">
          <img src={`/img/${theme === 'light-red' ? 'meW.png' : 'me.png'}`} alt="Profile" className="profile-image" />
        </div>
      </div>

      {/* Bottom section with choice text and buttons */}
      <div className="bottom-section">
        <h2 className="choice-text">Обери свою сторону</h2>
        
        <div className="buttons-container">
          <button className="choice-button" onClick={handleLeftButtonClick} disabled={isTransitioning || theme === 'dark-red'}>
            <div className="button-image-placeholder">
              <img 
                src={`img/${leftImages[leftIndex]}`} 
                alt="Left choice" 
                className="button-image"
              />
            </div>
          </button>
          
          <button className="choice-button" onClick={handleRightButtonClick} disabled={isTransitioning || theme === 'light-red'}>
            <div className="button-image-placeholder">
              <img 
                src={`img/${rightImages[rightIndex]}`} 
                alt="Right choice" 
                className="button-image"
              />
            </div>
          </button>
        </div>

        <div className="volume-control">
          <label className="volume-label" htmlFor="volume-slider">
            Додай звуку, перед читанням
          </label>
          <input
            id="volume-slider"
            className="volume-slider"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            aria-label="Volume control"
          />
        </div>

        <button className="letter-button" onClick={handleLetterKClick}>
          <div className="letter-button-image-placeholder">
            <img 
              src={`img/${isButtonClicked ? 'letterO.PNG' : 'letterK.PNG'}`} 
              alt="Letter button" 
              className="letter-button-image"
            />
          </div>
        </button>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-button" onClick={closeModal}>
              ✕
            </button>
            <div className="modal-paper-container">
              <img src="img/paper.PNG" alt="Paper" className="modal-paper-image" />
              <div className={`richard-overlay ${shouldShowRichard ? 'visible' : ''}`} aria-hidden="true">
                <img src="img/richard.png" alt="" className="richard-image" />
              </div>
              <div className="modal-text-overlay">
                <div className="typed-text" aria-live="polite">
                  {renderTypedText()}
                  <span className="typed-caret">|</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="hardskills-container">
        <h2 className="choice-text">Hardskills</h2>
        <div className="hardskills-carousel-shell">
          <Swiper
            className="hardskills-swiper"
            modules={[Navigation]}
            navigation
            centeredSlides
            slidesPerView={3}
            spaceBetween={25}
            loop
            grabCursor
            speed={450}
            breakpoints={{
              0: {
                slidesPerView: 3,
                spaceBetween: 10
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 18
              }
            }}
          >
            {hardSkills.map((skill) => (
              <SwiperSlide key={skill.label}>
                <div className="hardskill-card">
                  <img src={`img/${skill.label}`} alt={skill.label} className="hardskill-label" />
                  <div className="hardskill-text">{skill.text}</div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
      <div className="terminal-section">
      <div className="terminal-container">
        <div className="terminal-window" aria-live="polite">
          <div className="terminal-topbar" aria-hidden="true">
            <div className="terminal-topbar-dots">
              <span className="terminal-topbar-dot red" />
              <span className="terminal-topbar-dot yellow" />
              <span className="terminal-topbar-dot green" />
            </div>
            <span className="terminal-topbar-title">PowerShell</span>
          </div>

          

          <div className="terminal-row terminal-prompt-row">
            <span className="terminal-prompt">{terminalPrompt}</span>
            {terminalSelection && (
              <span
                className="terminal-choice"
                style={{ color: '#f5c542', marginLeft: '8px' }}
              >
                {terminalSelection}
              </span>
            )}
            {!terminalSuggestionVisible && !terminalSelection && (
              <button type="button" className="terminal-show-suggestion" onClick={handleShowSuggestion}>
                show suggestion
              </button>
            )}
          </div>

          <div className="terminal-output">
            <p className="terminal-paragraph" style={{ whiteSpace: 'pre-wrap', overflowWrap: 'break-word', margin: 0 }}>
              {terminalCompletedText}
              {terminalCurrentText}
              {!terminalCanClear && (terminalCompletedText.length > 0 || terminalCurrentText.length > 0) && (
                <span className="terminal-cursor terminal-cursor-inline" aria-hidden="true">|</span>
              )}
            </p>
            {terminalCanClear && (
              <button 
                ref={terminalOutputEndRef}
                type="button" 
                className="terminal-clear-button" 
                onClick={handleClearTerminal}
              >
                clear terminal
              </button>
            )}
            {!terminalCanClear && (
              <span ref={terminalOutputEndRef} aria-hidden="true" />
            )}
          </div>
        </div>
      </div>
      {terminalSuggestionVisible && (
            <div className="terminal-suggestion-popup" role="dialog" aria-label="terminal suggestions">
              <div className="terminal-suggestion-popup-body" role="group" aria-label="terminal suggestions">
                <button
                  type="button"
                  className={`terminal-option ${terminalSelection === 'why_me' ? 'is-active' : ''}`}
                  onClick={() => handleTerminalChoice('why_me')}
                  disabled={terminalSelection !== null && terminalSelection !== 'why_me'}
                >
                  why_me
                </button>
                <button
                  type="button"
                  className={`terminal-option ${terminalSelection === 'why_ctf' ? 'is-active' : ''}`}
                  onClick={() => handleTerminalChoice('why_ctf')}
                  disabled={terminalSelection !== null && terminalSelection !== 'why_ctf'}
                >
                  why_CTF
                </button>
              </div>
            </div>
          )}
          </div>
      <div className="details-section">
        <h2 className="choice-text">За деталями нижче</h2>
        <a className="details-link" href="https://t.me/not_a_virus_exe_bot" target="_blank" rel="noreferrer">
          virus228.exe
        </a>
      </div>
    </div>
  );
};

export default LandingPage;
