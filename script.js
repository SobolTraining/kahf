// ==========================================
// 1. نظام النافذة الافتتاحية (Splash Toast)
// ==========================================
let toastInterval;
function closeToast(isManual = false) {
    const toast = document.getElementById('splashToast');
    if(toast && !toast.classList.contains('hidden')) {
        toast.classList.add('opacity-0');
        if (isManual) clearInterval(toastInterval);
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 500);
    }
}

function startToastTimer() {
    let timeLeft = 3;
    const timerElement = document.getElementById('toastTimer');
    toastInterval = setInterval(() => {
        timeLeft--;
        if(timerElement) timerElement.innerText = timeLeft;
        if(timeLeft <= 0) {
            clearInterval(toastInterval);
            closeToast();
        }
    }, 1000);
}

// ==========================================
// 2. نظام الوضع الليلي (Dark/Light Mode) الشامل
// ==========================================
function toggleTheme() {
    const htmlTag = document.documentElement;
    const themeIcons = document.querySelectorAll('.themeIcon');
    htmlTag.classList.toggle('dark');
    const isDark = htmlTag.classList.contains('dark');
    
    themeIcons.forEach(icon => {
        icon.className = isDark ? "themeIcon fa-solid fa-sun" : "themeIcon fa-solid fa-moon";
    });
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// ==========================================
// 3. تهيئة الصفحة عند التحميل (DOMContentLoaded)
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    const toast = document.getElementById('splashToast');
    if (!sessionStorage.getItem('splashSeen')) {
        if(toast) {
            toast.classList.remove('hidden');
            setTimeout(() => toast.classList.remove('opacity-0'), 50);
        }
        startToastTimer();
        sessionStorage.setItem('splashSeen', 'true');
    }

    const isDark = localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    const themeIcons = document.querySelectorAll('.themeIcon');
    if (isDark) {
        document.documentElement.classList.add('dark');
        themeIcons.forEach(icon => icon.className = "themeIcon fa-solid fa-sun");
    } else {
        document.documentElement.classList.remove('dark');
        themeIcons.forEach(icon => icon.className = "themeIcon fa-solid fa-moon");
    }

    fetch('footer.html')
    .then(response => {
        if (response.ok) return response.text();
    })
    .then(data => {
        const footerNav = document.getElementById('footernav');
        if (footerNav && data) {
            footerNav.innerHTML = data;
        }
        
        setTimeout(() => {
            if (typeof handleKhatmaTypeChange === "function") {
                handleKhatmaTypeChange();
            }

            const currentPage = window.location.pathname.toLowerCase();
            const isIndexPage = currentPage.endsWith('index.html') || currentPage.endsWith('/') || !currentPage.includes('.html');
            const addKhatmaBtn = document.querySelector('button[onclick="openModal(\'khatmaModal\')"]');
            
            if (addKhatmaBtn && !isIndexPage) {
                addKhatmaBtn.removeAttribute('onclick');
                addKhatmaBtn.classList.replace('from-teal-600', 'from-slate-400');
                addKhatmaBtn.classList.replace('to-emerald-400', 'to-slate-300');
                addKhatmaBtn.classList.replace('shadow-teal-500/40', 'shadow-slate-500/40');
                addKhatmaBtn.classList.remove('active:scale-95');
                addKhatmaBtn.style.cursor = 'not-allowed';

                addKhatmaBtn.addEventListener('click', () => {
                    if(typeof showToast === 'function') {
                        showToast('إنشاء ختمة متاح فقط من الصفحة الرئيسية حالياً 🏠');
                    }
                });
            }
        }, 100);
    })
    .catch(err => console.error("Error loading footer:", err));
});

// ==========================================
// 4. دوال النوافذ والمشاركة العامة
// ==========================================
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if(modal) {
        modal.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if(modal) {
        modal.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
    }
}

function copyLink() {
    const linkText = document.getElementById('siteLink')?.innerText || window.location.href;
    navigator.clipboard.writeText(linkText).then(() => {
        const copyBtn = document.getElementById('copyBtn');
        if(copyBtn) {
            copyBtn.innerText = "تم النسخ";
            copyBtn.classList.replace('text-teal-600', 'text-emerald-600');
            setTimeout(() => {
                copyBtn.innerText = "نسخ";
                copyBtn.classList.replace('text-emerald-600', 'text-teal-600');
            }, 2000);
        }
    });
}

function shareSite() {
    if (navigator.share) {
        navigator.share({
            title: 'الكهف',
            text: 'صدقة جارية وملاذ روحي يجمع قراءة القرآن والأدعية. شاركنا الأجر.',
            url: window.location.origin
        }).catch((error) => console.log('خطأ في المشاركة:', error));
    } else {
        alert('عذراً، ميزة المشاركة غير مدعومة في هذا المتصفح.');
    }
}

function sendMessage() {
    const textArea = document.querySelector('textarea');
    if(!textArea) return;
    const msgText = textArea.value.trim();
    if (msgText === '') {
        alert('عذراً، يرجى كتابة رسالتك قبل الإرسال!');
        return;
    }
    const sendBtn = document.getElementById('sendBtn');
    if(sendBtn) {
        const originalText = sendBtn.innerText;
        sendBtn.innerText = "تم الإرسال بنجاح";
        sendBtn.classList.replace('bg-teal-600', 'bg-emerald-500');
        setTimeout(() => {
            closeModal('contactModal');
            setTimeout(() => {
                sendBtn.innerText = originalText;
                sendBtn.classList.replace('bg-emerald-500', 'bg-teal-600');
                textArea.value = '';
            }, 500);
        }, 1500);
    }
}

function processPayment(method) {
    alert("سيتم نقلك قريباً إلى بوابة الدفع الآمنة الخاصة بـ: " + method);
}

// ==========================================
// 5. دوال الختمة الذكية
// ==========================================
function switchKhatmaTab(tabName) {
    const tabs = ['create', 'join', 'archive'];
    tabs.forEach(t => {
        const tabEl = document.getElementById('tab-' + t);
        const btn = document.getElementById('tabBtn-' + t);
        if(tabEl) tabEl.classList.add('hidden');
        if(btn) {
            btn.classList.remove('text-teal-600', 'border-b-2', 'border-teal-600');
            btn.classList.add('text-gray-400');
        }
    });
    const activeTab = document.getElementById('tab-' + tabName);
    const activeBtn = document.getElementById('tabBtn-' + tabName);
    if(activeTab) activeTab.classList.remove('hidden');
    if(activeBtn) {
        activeBtn.classList.remove('text-gray-400');
        activeBtn.classList.add('text-teal-600', 'border-b-2', 'border-teal-600');
    }
}

function handleImageUpload(input) {
    const uploadBox = document.getElementById('uploadBox');
    const uploadText = document.getElementById('uploadText');
    const uploadIcon = document.getElementById('uploadIcon');
    const imagePreview = document.getElementById('imagePreview');
    
    // 💡 التعديل هنا: ضفنا [ 0 ] بجانب input.files
    if (input.files && input.files[0]) {
        const file = input.files[0];
        const fileName = file.name;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            if(imagePreview) {
                imagePreview.src = e.target.result;
                imagePreview.classList.remove('hidden');
            }
            if(uploadIcon) uploadIcon.classList.add('hidden');
        }
        reader.readAsDataURL(file);
        
        if(uploadText) {
            uploadText.innerText = "تم إرفاق: " + fileName;
            uploadText.classList.replace('text-gray-500', 'text-emerald-600');
        }
        if(uploadBox) {
            uploadBox.classList.replace('border-teal-200', 'border-emerald-300');
            uploadBox.classList.add('bg-emerald-50/50');
        }
    }
}

// ==========================================
// ==========================================
// 6. القاموس الذكي الشامل (الجديد كلياً)
// ==========================================
const khatmaCategories = {
    quran_full: {
        categoryKey: "quraan",
        layout: "grid", 
        prefix: "ختمة",
        label: "قرآنية كاملة",
        // 👇 تم إضافة النص الروحاني للقرآن
        rewardText: " إذا التبست عليكم الفتن كقطع الليل المظلم، فعليكم بالقرآن، فانه شافع مشفع، وماحِل مصدق، ومن جعله أمامه قاده إلى الجنة.",
        options: [
            { id: "30", name: "مقسّمة لأجزاء (30 قارئ)" },
            { id: "60", name: "مقسّمة لأحزاب (60 قارئ)" },
            { id: "121", name: "كل 5 صفحات (121 قارئ)" },
            { id: "1page", name: "صفحة واحدة لكل قارئ", layout: "random_page" } 
        ]
    },
    quran_surah: {
        categoryKey: "quraan",
        layout: "counter",
        prefix: "سورة",
        label: "سور قرآنية",
        // 👇 تم إضافة النص الروحاني للسور
        rewardText: " لكل سورةٍ من كتاب الله أسرار ربّانية وخصائص في قضاء الحوائج وشفاء الصدور.",
        options: [
            { id: "yaseen", name: "يس" },
            { id: "fat7", name: "الفتح" },
            { id: "najim", name: "النجم" },
            { id: "maryam", name: "مريم" },
            { id: "ayatkorsi", name: "آية الكرسي" }
        ]
    },
    do3a2: {
        categoryKey: "do3a2",
        layout: "counter",
        prefix: "دعاء",
        label: " أدعية لقضاء الحوائج",
        // 👇 تم إضافة النص الروحاني للأدعية
        rewardText: "الدعاء سلاح المؤمن، وإن اللّه عز وجل يحب العبد اللحوح.",
        options: [  
            { id: "yastashir", name: "يستشير" },
            { id: "almashloul", name: "المشلول" },
            { id: "jibra2il", name: "جبرائيل" },
            { id: "ahelaltho8our", name: "أهل الثغور" },
            { id: "7adithkisaa", name: "حديث الكساء" },
            { id: "jawshan", name: "الجوشن الكبير", layout: "grid" } 
        ]
    },
    ziyara: {
        categoryKey: "ziyara",
        layout: "counter",
        prefix: "زيارة",
        label: "الزيارات المباركة",
        // 👇 تم إضافة النص الروحاني للزيارات
        rewardText: " توجهوا إلى الله عز وجل بأهل بيته.",
        options: [
            { id: "ashoura", name: "عاشوراء" },
            { id: "yamomta7ana", name: "يا ممتحنة" },
            { id: "alyassine", name: "آل يس" }
        ]
    }
};



function handleKhatmaTypeChange() {
    const mainCatValue = document.getElementById('mainCategory').value;
    const subCatSelect = document.getElementById('subCategory');
    const targetCountContainer = document.getElementById('targetCountContainer');
    const rewardContainer = document.getElementById('rewardTextContainer');

    subCatSelect.innerHTML = '<option value="" disabled selected>-- اختر التفاصيل --</option>';

    if (mainCatValue && khatmaCategories[mainCatValue]) {
        subCatSelect.disabled = false;
        const options = khatmaCategories[mainCatValue].options;

        options.forEach(opt => {
            const newOption = document.createElement('option');
            newOption.value = opt.id;
            newOption.text = opt.name;
            subCatSelect.appendChild(newOption);
        });

        // إذا كان قرآن كامل، نخفي مربع العداد اليدوي
        if (mainCatValue === 'quran_full') {
            if(targetCountContainer) targetCountContainer.classList.add('hidden');
        } else {
            if(targetCountContainer) targetCountContainer.classList.remove('hidden');
        }

         if(rewardContainer) {
            // رح يسحب النص الروحاني المخصص اللي كتبتيه فوق بالقاموس
            rewardContainer.innerHTML = khatmaCategories[mainCatValue].rewardText;
            rewardContainer.classList.remove('hidden');
        }

    } else {
        subCatSelect.disabled = true;
        if(targetCountContainer) targetCountContainer.classList.add('hidden');
        if(rewardContainer) rewardContainer.classList.add('hidden');
    }
}

function createKhatma() {
    const nameInput = document.getElementById('khatmaName');
    const mainCategory = document.getElementById('mainCategory').value;
    const subCategory = document.getElementById('subCategory').value;
    const targetCountInput = document.getElementById('targetCount');
    const errorMsg = document.getElementById('formErrorMsg');

    if (!nameInput.value.trim() || !mainCategory || !subCategory) {
        if (errorMsg) errorMsg.classList.remove('hidden');
        return;
    } else {
        if (errorMsg) errorMsg.classList.add('hidden');
    }

    const categoryData = khatmaCategories[mainCategory];
    const itemData = categoryData.options.find(opt => opt.id === subCategory);

    const layout = itemData.layout || categoryData.layout;
    const categoryKey = categoryData.categoryKey;
    
    let itemValue = '';
    let typeValue = '';
    let targetValue = 40;

    if (mainCategory === 'quran_full') {
        itemValue = 'quran_full';
        if (subCategory !== '1page') {
            typeValue = subCategory; 
            targetValue = subCategory; 
        } else {
            targetValue = 1; 
        }
    } else {
        itemValue = subCategory; 
        targetValue = targetCountInput.value || 40;
    }

    const finalTitle = `${categoryData.prefix} ${itemData.name}`.trim();
    const intentionName = encodeURIComponent(nameInput.value.trim());
    const uniqueId = 'khatma_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);

    const baseUrl = window.location.origin + window.location.pathname.replace('index.html', '').replace(/\/$/, '') + '/khatma.html';
    let finalUrl = `${baseUrl}?layout=${layout}&category=${categoryKey}&item=${itemValue}&id=${uniqueId}&name=${intentionName}&title=${encodeURIComponent(finalTitle)}&target=${targetValue}`;
    
    if (layout === 'grid' && mainCategory === 'quran_full') {
        finalUrl += `&type=${typeValue}`;
    }

    const imagePreview = document.getElementById('imagePreview');
    if (imagePreview && !imagePreview.classList.contains('hidden')) {
        try {
            localStorage.setItem(uniqueId + '_image', imagePreview.src);
        } catch (e) {
            console.log("الصورة كبيرة جداً على التخزين المحلي");
        }
    }

    try {
        if(window.db && window.setDoc && window.doc) {
            window.setDoc(window.doc(window.db, 'khatmat', uniqueId), {
                id: uniqueId,
                name: nameInput.value.trim(),
                category: categoryKey,
                item: itemValue,
                layout: layout,
                target: parseInt(targetValue),
                mahjuz: 0,
                cycle: 1,
                timestamp: Date.now()
            });
            const statsRef = window.doc(window.db, 'statistics', 'global_counters');
            window.updateDoc(statsRef, { total_khatmat: window.increment(1) }).catch(e => {
                window.setDoc(statsRef, { total_khatmat: 1, total_participants: 0 });
            });
        }
    } catch(err) { console.error(err); }

    const linkSpan = document.getElementById('khatmaLink');
    if (linkSpan) linkSpan.innerText = finalUrl;
    
    const whatsappBtn = document.querySelector('#khatmaSuccessModal .fa-whatsapp');
    if(whatsappBtn && whatsappBtn.parentElement) {
        whatsappBtn.parentElement.onclick = () => {
            const message = `شاركني الأجر في هذه الختمة الروحانية لـ ${nameInput.value.trim()}:\n${finalUrl}`;
            window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
        };
    }

    closeModal('khatmaModal');
    setTimeout(() => {
        const successModal = document.getElementById('khatmaSuccessModal');
        if(successModal) successModal.classList.remove('hidden');
        setTimeout(() => { window.location.href = finalUrl; }, 3000);
    }, 300);
}

function copyKhatmaLink() {
    const linkText = document.getElementById('khatmaLink')?.innerText;
    if(!linkText) return;
    navigator.clipboard.writeText(linkText).then(() => {
        const copyBtn = document.getElementById('copyKhatmaBtn');
        if(copyBtn) {
            copyBtn.innerText = "تم";
            copyBtn.classList.replace('text-teal-600', 'text-emerald-600');
            setTimeout(() => {
                copyBtn.innerText = "نسخ";
                copyBtn.classList.replace('text-emerald-600', 'text-teal-600');
            }, 2000);
        }
    });
}

function joinOpenKhatma() {
    const randomPage = Math.floor(Math.random() * 604) + 1;
    alert(`تم اختيار الصفحة رقم (${randomPage}) لك. سيتم تحويلك للقراءة...`);
    window.location.href = `reader.html?label=${encodeURIComponent('صفحة ' + randomPage)}`;
}