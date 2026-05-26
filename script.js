document.addEventListener('DOMContentLoaded', () => {

    // Header Scroll Effect
    const header = document.getElementById('header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Close mobile menu when clicking a link
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });

    // Intersection Observer for Scroll Animations
    const animationElements = document.querySelectorAll('.fade-in, .fade-in-up, .slide-in-left, .slide-in-right, .slide-in-bottom');

    // Check if initial viewport elements are visible before scroll
    const checkInitialVisibility = () => {
        animationElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                el.classList.add('appear');
            }
        });
    };

    const appearOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function (entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target);
            }
        });
    }, appearOptions);

    animationElements.forEach(el => {
        appearOnScroll.observe(el);
    });

    // Trigger initial check
    setTimeout(checkInitialVisibility, 100);

    // Smooth Scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // EmailJS Contact Form Integration
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = document.getElementById('btn-text');
    const btnLoader = document.getElementById('btn-loader');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show loader
            if (btnText && btnLoader && submitBtn) {
                btnText.style.display = 'none';
                btnLoader.style.display = 'inline-block';
                submitBtn.disabled = true;
            }
            
            // Format current date and time
            const now = new Date();
            const timeString = now.getFullYear() + '-' + 
                               String(now.getMonth() + 1).padStart(2, '0') + '-' + 
                               String(now.getDate()).padStart(2, '0') + ' ' + 
                               String(now.getHours()).padStart(2, '0') + ':' + 
                               String(now.getMinutes()).padStart(2, '0') + ':' + 
                               String(now.getSeconds()).padStart(2, '0');

            // Send via emailjs
            const templateParams = {
                title: document.getElementById('contact-title').value,
                name: document.getElementById('contact-name').value,
                email: document.getElementById('contact-email').value,
                message: document.getElementById('contact-message').value,
                time: timeString
            };

            emailjs.send('service_jjeong', 'template_2v7qgmc', templateParams)
                .then(function(response) {
                    alert('성공적으로 메시지가 전송되었습니다! 빠른 시일 내에 답변해 드리겠습니다.');
                    contactForm.reset();
                }, function(error) {
                    alert('메시지 전송에 실패했습니다. 잠시 후 다시 시도해 주세요: ' + JSON.stringify(error));
                })
                .finally(function() {
                    // Hide loader
                    if (btnText && btnLoader && submitBtn) {
                        btnText.style.display = 'inline-block';
                        btnLoader.style.display = 'none';
                        submitBtn.disabled = false;
                    }
                });
        });
    }
});

// Toggle Section Function
window.toggleSection = function (contentId, btn) {
    const content = document.getElementById(contentId);
    btn.classList.toggle('active');
    content.classList.toggle('open');
};

// Chatbot Logic
const chatWindow = document.getElementById('chat-window');
const greetingBubble = document.getElementById('greeting-bubble');
const chatMessages = document.getElementById('chat-messages');
const chatOptions = document.getElementById('chat-options');
let isChatOpen = false;

window.toggleChat = function () {
    isChatOpen = !isChatOpen;
    if (isChatOpen) {
        chatWindow.classList.add('active');
        greetingBubble.style.display = 'none';
        if (chatMessages.children.length === 0) {
            initChat();
        }
    } else {
        chatWindow.classList.remove('active');
    }
};

const chatData = {
    'greeting': {
        text: '안녕! 나는 양구군 마스코트 배꼬비야. 국토의 정중앙 양구에 대해 무엇이 궁금해?',
        options: [
            { label: '지역', target: 'region' },
            { label: '관광', target: 'tourism' },
            { label: '음식점', target: 'food' },
            { label: '갈만한 곳', target: 'places' }
        ]
    },
    'region': {
        text: '양구는 대한민국 국토의 정중앙에 위치한 맑고 깨끗한 생태도시야. 때묻지 않은 자연과 역사, 문화가 살아 숨쉬는 곳이지! 🌲',
        options: [
            { label: '관광', target: 'tourism' },
            { label: '처음으로', target: 'greeting' }
        ]
    },
    'tourism': {
        text: '양구에는 아름다운 두타연, 신비로운 해안분지(펀치볼), 그리고 한반도 모양의 한반도섬 등 멋진 관광지가 정말 많아! ⛰️',
        options: [
            { label: '음식점', target: 'food' },
            { label: '처음으로', target: 'greeting' }
        ]
    },
    'food': {
        text: '금강산도 식후경! 양구에는 18곳의 안심하고 즐길 수 있는 모범음식점이 지정되어 있어. 하단의 음식점 메뉴에서 삼계탕, 막국수 등을 확인해봐! 🍲',
        options: [
            { label: '갈만한 곳', target: 'places' },
            { label: '처음으로', target: 'greeting' }
        ]
    },
    'places': {
        text: '가족, 연인과 함께라면 양구수목원, 박수근미술관, 국토정중앙천문대를 강력 추천해! 자연 속에서 힐링하고 별도 볼 수 있는 낭만적인 곳이야 ✨',
        options: [
            { label: '처음으로', target: 'greeting' }
        ]
    }
};

function addMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${sender}`;
    msgDiv.innerHTML = text;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function renderOptions(options) {
    chatOptions.innerHTML = '';
    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'chat-option-btn';
        btn.textContent = opt.label;
        btn.onclick = () => {
            addMessage(opt.label, 'user');
            chatOptions.innerHTML = ''; // Clear options while typing
            setTimeout(() => {
                handleBotResponse(opt.target);
            }, 500); // Simulate network delay
        };
        chatOptions.appendChild(btn);
    });
}

function handleBotResponse(targetId) {
    const data = chatData[targetId];
    if (data) {
        addMessage(data.text, 'bot');
        renderOptions(data.options);
    }
}

function initChat() {
    setTimeout(() => {
        handleBotResponse('greeting');
    }, 300);
}

// Weather API Integration (Open-Meteo for Yanggu)
async function fetchWeather() {
    const weatherWidget = document.getElementById('weather-widget');
    if (!weatherWidget) return;
    
    try {
        // Yanggu coordinates: 38.1066, 127.9868
        const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=38.1066&longitude=127.9868&current_weather=true');
        const data = await response.json();
        
        if (data && data.current_weather) {
            const temp = Math.round(data.current_weather.temperature);
            let icon = 'fa-sun';
            // Simple logic for icon based on weathercode
            const code = data.current_weather.weathercode;
            if (code >= 1 && code <= 3) icon = 'fa-cloud-sun';
            if (code >= 45 && code <= 48) icon = 'fa-smog';
            if (code >= 51 && code <= 67) icon = 'fa-cloud-rain';
            if (code >= 71 && code <= 77) icon = 'fa-snowflake';
            
            weatherWidget.innerHTML = `<i class="fas ${icon}"></i> 양구 ${temp}°C`;
        }
    } catch (error) {
        console.error('Failed to fetch weather:', error);
        weatherWidget.innerHTML = `<i class="fas fa-cloud"></i> 양구 날씨`;
    }
}

// Initialize Weather
fetchWeather();

// Google Translate Initialization
window.googleTranslateElementInit = function() {
    new google.translate.TranslateElement({
        pageLanguage: 'ko',
        includedLanguages: 'en,ja,zh-CN,zh-TW',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false
    }, 'google_translate_element');
};

// Fortune Cookie Logic
const fortunes = [
    "오늘 당신의 하루는 두타연의 맑은 계곡물처럼 투명하고 시원하게 풀릴 것입니다!",
    "펀치볼처럼 둥글고 넉넉한 마음을 가지면 뜻밖의 행운이 찾아옵니다.",
    "한반도의 정중앙 양구의 기운을 받아, 오늘 당신이 세상의 중심이 될 것입니다!",
    "박수근 화백의 그림처럼 소박하지만 따뜻하고 아름다운 인연을 만나게 될 징조입니다.",
    "국토정중앙천문대에서 쏟아지는 별빛처럼, 오늘은 반짝이는 아이디어가 떠오를 거예요.",
    "청춘 양구의 이름처럼, 오늘 하루 젊고 활기찬 에너지가 당신을 가득 채울 것입니다."
];

const fortuneCookie = document.getElementById('fortune-cookie');
const fortuneModal = document.getElementById('fortune-modal');
const fortuneText = document.getElementById('fortune-text');

// Randomly spawn the cookie
function scheduleCookieSpawn() {
    // Spawn randomly between 10s and 25s
    const randomTime = Math.floor(Math.random() * 15000) + 10000;
    setTimeout(() => {
        if (fortuneCookie && !fortuneCookie.classList.contains('show')) {
            // Random horizontal position (left or right side)
            const isLeft = Math.random() > 0.5;
            fortuneCookie.style.left = isLeft ? '30px' : 'auto';
            fortuneCookie.style.right = isLeft ? 'auto' : '30px';
            fortuneCookie.classList.add('show');
            
            // Hide after 7 seconds if not clicked
            setTimeout(() => {
                if (fortuneCookie.classList.contains('show')) {
                    fortuneCookie.classList.remove('show');
                    scheduleCookieSpawn(); // Schedule next spawn
                }
            }, 7000);
        }
    }, randomTime);
}

// Start the spawning cycle
if (fortuneCookie && fortuneModal) {
    scheduleCookieSpawn();
}

window.openFortune = function() {
    // Hide cookie
    fortuneCookie.classList.remove('show');
    
    // Pick random fortune
    const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
    fortuneText.innerText = randomFortune;
    
    // Show modal
    fortuneModal.classList.add('active');
};

window.closeFortune = function() {
    fortuneModal.classList.remove('active');
    // Schedule next spawn after closing
    scheduleCookieSpawn();
};

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === fortuneModal) {
        closeFortune();
    }
});

// Switch Gomchwi Image function for premium gallery
window.switchGomchwiImage = function (imgSrc, altText, thumbEl) {
    const mainImg = document.getElementById('gomchwi-main-img');
    const badge = document.getElementById('gomchwi-badge');
    if (mainImg) {
        mainImg.classList.add('fade-out-temp'); // smooth transition
        setTimeout(() => {
            mainImg.src = imgSrc;
            mainImg.alt = altText;
            if (badge) {
                badge.textContent = altText;
            }
            mainImg.classList.remove('fade-out-temp');
        }, 150);
    }
    
    // Switch active thumbnail class
    const thumbs = document.querySelectorAll('.thumb-item');
    thumbs.forEach(t => t.classList.remove('active'));
    thumbEl.classList.add('active');
};

