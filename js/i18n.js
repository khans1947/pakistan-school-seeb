/**
 * Full EN / AR / UR translation for Pakistan School Seeb
 * - data-i18n keys for structured UI
 * - Phrase dictionary walk for body text (stores original in data-pss-en)
 */
(function () {
  'use strict';

  const STRINGS = {
    en: {
      'nav.home': 'Home',
      'nav.admissions': 'Admissions',
      'nav.academics': 'Academics',
      'nav.books': 'Books',
      'nav.gallery': 'Student Life',
      'nav.contact': 'Contact',
      'nav.portals': 'Portals',
      'nav.apply': 'Apply Now',
      'tab.junior': 'Junior Wing',
      'tab.senior': 'Senior Wing',
      'tab.fbise': 'FBISE Curriculum',
      'tab.cambridge': 'Cambridge IGCSE',
      'streams.title': 'Academic Streams',
      'network.title': 'Pakistan Schools Oman',
      'network.subtitle': 'One family of schools serving communities across the Sultanate.',
      'network.h3': 'Connected Excellence',
      'track.title': 'Track Your Application',
      'track.subtitle': 'Enter your Application ID and the phone or email used when applying.',
      'track.id_label': 'Application ID',
      'track.verify_label': 'Phone or Email',
      'track.btn': 'View Status',
      'legal.privacy': 'Privacy Policy',
      'legal.terms': 'Terms of Service',
      'books.uniforms': 'Uniforms & Stationery',
      'stock.in': 'In Stock',
      'stock.low': 'Low Stock',
      'stock.out': 'Out of Stock',
      'fees.title': 'Fee Structure',
      'notices.title': 'Notices & Circulars',
      'lang.label': 'Language',
      'chat.placeholder': 'Type your question...'
    },
    ar: {
      'nav.home': 'الرئيسية',
      'nav.admissions': 'القبول',
      'nav.academics': 'الأكاديميات',
      'nav.books': 'الكتب',
      'nav.gallery': 'حياة الطلاب',
      'nav.contact': 'اتصل بنا',
      'nav.portals': 'البوابات',
      'nav.apply': 'قدّم الآن',
      'tab.junior': 'القسم الابتدائي',
      'tab.senior': 'القسم الثانوي',
      'tab.fbise': 'منهج FBISE',
      'tab.cambridge': 'كامبريدج IGCSE',
      'streams.title': 'المسارات الأكاديمية',
      'network.title': 'مدارس باكستان عمان',
      'network.subtitle': 'عائلة واحدة من المدارس تخدم المجتمعات في سلطنة عمان.',
      'network.h3': 'تميّز متصل',
      'track.title': 'تتبع طلبك',
      'track.subtitle': 'أدخل رقم الطلب والهاتف أو البريد المستخدم عند التقديم.',
      'track.id_label': 'رقم الطلب',
      'track.verify_label': 'الهاتف أو البريد',
      'track.btn': 'عرض الحالة',
      'legal.privacy': 'سياسة الخصوصية',
      'legal.terms': 'شروط الخدمة',
      'books.uniforms': 'الزي والقرطاسية',
      'stock.in': 'متوفر',
      'stock.low': 'مخزون منخفض',
      'stock.out': 'غير متوفر',
      'fees.title': 'هيكل الرسوم',
      'notices.title': 'الإعلانات والتعاميم',
      'lang.label': 'اللغة',
      'chat.placeholder': 'اكتب سؤالك...'
    },
    ur: {
      'nav.home': 'ہوم',
      'nav.admissions': 'داخلہ',
      'nav.academics': 'تعلیم',
      'nav.books': 'کتابیں',
      'nav.gallery': 'طلبہ زندگی',
      'nav.contact': 'رابطہ',
      'nav.portals': 'پورٹلز',
      'nav.apply': 'اب اپلائی کریں',
      'tab.junior': 'جونیئر ونگ',
      'tab.senior': 'سینئر ونگ',
      'tab.fbise': 'FBISE نصاب',
      'tab.cambridge': 'کیمبرج IGCSE',
      'streams.title': 'تعلیمی راستے',
      'network.title': 'پاکستان سکولز عمان',
      'network.subtitle': 'سلطنت بھر میں کمیونٹیز کی خدمت کرنے والے اسکولوں کا ایک خاندان۔',
      'network.h3': 'جڑا ہوا کمال',
      'track.title': 'اپنی درخواست ٹریک کریں',
      'track.subtitle': 'درخواست آئی ڈی اور فون یا ای میل درج کریں۔',
      'track.id_label': 'درخواست آئی ڈی',
      'track.verify_label': 'فون یا ای میل',
      'track.btn': 'حیثیت دیکھیں',
      'legal.privacy': 'رازداری کی پالیسی',
      'legal.terms': 'شرائط و ضوابط',
      'books.uniforms': 'یونیفارم اور اسٹیشنری',
      'stock.in': 'دستیاب',
      'stock.low': 'کم اسٹاک',
      'stock.out': 'ختم',
      'fees.title': 'فیس کا ڈھانچہ',
      'notices.title': 'نوٹس اور سرکولر',
      'lang.label': 'زبان',
      'chat.placeholder': 'اپنا سوال لکھیں...'
    }
  };

  /** Exact English phrase → translations (longest phrases first when sorting) */
  const PHRASES = {
    'Nurturing Future': { ar: 'نُنشئ مستقبلًا', ur: 'مستقبل ساز' },
    'Leaders in Seeb': { ar: 'قادة في السيب', ur: 'سیب میں رہنما' },
    'Apply Online': { ar: 'قدّم عبر الإنترنت', ur: 'آن لائن درخواست' },
    'Apply Now': { ar: 'قدّم الآن', ur: 'اب اپلائی کریں' },
    'Take a Virtual Tour': { ar: 'خذ جولة افتراضية', ur: 'ورچوئل ٹور' },
    'Branch of Pakistan School Muscat · Est. 2014': {
      ar: 'فرع مدرسة باكستان مسقط · تأسست 2014',
      ur: 'پاکستان سکول مسقط کی برانچ · قیام 2014'
    },
    'A vibrant learning community delivering FBISE and Cambridge pathways, fostering academic excellence, character, and global citizenship in the heart of Al Seeb, Muscat.': {
      ar: 'مجتمع تعليمي نابض يقدّم مساري FBISE وكامبريدج، ويعزّز التميّز الأكاديمي والشخصية والمواطنة العالمية في قلب السيب، مسقط.',
      ur: 'ال سیب، مسقط کے قلب میں FBISE اور کیمبرج راستے پیش کرنے والا متحرک تعلیمی کمیونٹی جو علمی کمال، کردار اور عالمی شہریت کو فروغ دیتا ہے۔'
    },
    'Students': { ar: 'طلاب', ur: 'طلبہ' },
    'Faculty': { ar: 'معلمون', ur: 'اساتذہ' },
    'Pass Rate': { ar: 'نسبة النجاح', ur: 'پاس شرح' },
    'Grades': { ar: 'الصفوف', ur: 'جماعتیں' },
    'About Us': { ar: 'من نحن', ur: 'ہمارے بارے میں' },
    'Heritage of Excellence': { ar: 'إرث من التميّز', ur: 'برتری کی روایت' },
    'Part of the esteemed Pakistan School Muscat network, serving the community in Seeb since 2014.': {
      ar: 'جزء من شبكة مدرسة باكستان مسقط المرموقة، نخدم مجتمع السيب منذ 2014.',
      ur: 'پاکستان سکول مسقط کے معتبر نیٹ ورک کا حصہ، 2014 سے سیب میں کمیونٹی کی خدمت۔'
    },
    'Pakistan School Seeb': { ar: 'مدرسة باكستان السيب', ur: 'پاکستان سکول سیب' },
    'Inaugurated on 21st August 2014, Pakistan School Seeb was established to extend quality, affordable education to families in Al Seeb and surrounding areas.': {
      ar: 'افتُتحت في 21 أغسطس 2014 لتقديم تعليم جيد وميسور التكلفة لعائلات السيب والمناطق المجاورة.',
      ur: '21 اگست 2014 کو افتتاح ہوا تاکہ ال سیب اور آس پاس کے خاندانوں کو معیاری، سستی تعلیم فراہم کی جا سکے۔'
    },
    'With more than 1,300 multinational students and classes from Kindergarten through Grade 12, we offer FBISE and Cambridge pathways in a caring, disciplined environment.': {
      ar: 'مع أكثر من 1300 طالب من جنسيات متعددة وصفوف من الروضة حتى الصف 12، نقدّم مساري FBISE وكامبريدج في بيئة راعية ومنضبطة.',
      ur: '1300 سے زائد کثیر القومی طلبہ اور کنڈرگارٹن سے گریڈ 12 تک، نگہداشت اور نظم کے ماحول میں FBISE اور کیمبرج۔'
    },
    "Principal's Welcome Message": { ar: 'كلمة ترحيب المدير', ur: 'پرنسپل کا خوش آمدیدی پیغام' },
    'Mission': { ar: 'الرسالة', ur: 'مشن' },
    'Vision': { ar: 'الرؤية', ur: 'ویژن' },
    'Values': { ar: 'القيم', ur: 'اقدار' },
    'Community': { ar: 'المجتمع', ur: 'کمیونٹی' },
    'Holistic education fostering critical thinking, collaboration & digital competence.': {
      ar: 'تعليم شامل يعزّز التفكير النقدي والتعاون والكفاءة الرقمية.',
      ur: 'جامع تعلیم جو تنقیدی سوچ، تعاون اور ڈیجیٹل مہارت کو فروغ دے۔'
    },
    'Curriculum': { ar: 'المنهج', ur: 'نصاب' },
    'Academic Streams': { ar: 'المسارات الأكاديمية', ur: 'تعلیمی راستے' },
    'Flexible pathways designed for every learner — from foundational years to board examinations.': {
      ar: 'مسارات مرنة لكل متعلم — من السنوات التأسيسية إلى امتحانات المجالس.',
      ur: 'ہر سیکھنے والے کے لیے لچکدار راستے — بنیادی سالوں سے بورڈ امتحانات تک۔'
    },
    'Junior Wing': { ar: 'القسم الابتدائي', ur: 'جونیئر ونگ' },
    'Senior Wing': { ar: 'القسم الثانوي', ur: 'سینئر ونگ' },
    'FBISE Curriculum': { ar: 'منهج FBISE', ur: 'FBISE نصاب' },
    'Cambridge IGCSE': { ar: 'كامبريدج IGCSE', ur: 'کیمبرج IGCSE' },
    'Early Years (KG–2)': { ar: 'السنوات المبكرة (روضة–2)', ur: 'ابتدائی سال (KG–2)' },
    'Primary (Grades 3–5)': { ar: 'الابتدائي (3–5)', ur: 'پرائمری (3–5)' },
    'Middle School (6–8)': { ar: 'المتوسط (6–8)', ur: 'مڈل اسکول (6–8)' },
    'Secondary (9–12)': { ar: 'الثانوي (9–12)', ur: 'سیکنڈری (9–12)' },
    'FBISE Islamabad': { ar: 'FBISE إسلام آباد', ur: 'FBISE اسلام آباد' },
    'Cambridge International': { ar: 'كامبريدج الدولية', ur: 'کیمبرج انٹرنیشنل' },
    'Explore Junior Wing': { ar: 'استكشف القسم الابتدائي', ur: 'جونیئر ونگ دیکھیں' },
    'View Curriculum': { ar: 'عرض المنهج', ur: 'نصاب دیکھیں' },
    'Learn More': { ar: 'اعرف المزيد', ur: 'مزید جانیں' },
    'Request Syllabus': { ar: 'اطلب المنهج', ur: 'نصاب کی درخواست' },
    'Facilities That Inspire': { ar: 'مرافق مُلهمة', ur: 'متاثر کن سہولیات' },
    'Our Facilities': { ar: 'مرافقنا', ur: 'ہماری سہولیات' },
    'STEM & Science Labs': { ar: 'مختبرات العلوم وSTEM', ur: 'STEM اور سائنس لیبز' },
    'Robotics Club': { ar: 'نادي الروبوتات', ur: 'روبوٹکس کلب' },
    'Digital Library': { ar: 'المكتبة الرقمية', ur: 'ڈیجیٹل لائبریری' },
    'Sports Grounds': { ar: 'الملاعب الرياضية', ur: 'کھیلوں کے میدان' },
    'Auditorium': { ar: 'القاعة', ur: 'آڈیٹوریم' },
    'ICT Labs': { ar: 'مختبرات الحاسوب', ur: 'آئی سی ٹی لیبز' },
    'Live Noticeboard': { ar: 'لوحة الإعلانات المباشرة', ur: 'لائیو نوٹس بورڈ' },
    'What Parents Say': { ar: 'ماذا يقول أولياء الأمور', ur: 'والدین کیا کہتے ہیں' },
    'Real stories from the Pakistan School Seeb family.': {
      ar: 'قصص حقيقية من عائلة مدرسة باكستان السيب.',
      ur: 'پاکستان سکول سیب خاندان کی حقیقی کہانیاں۔'
    },
    'Pakistan Schools Oman': { ar: 'مدارس باكستان عمان', ur: 'پاکستان سکولز عمان' },
    'One family of schools serving communities across the Sultanate.': {
      ar: 'عائلة واحدة من المدارس تخدم المجتمعات في سلطنة عمان.',
      ur: 'سلطنت بھر میں کمیونٹیز کی خدمت کرنے والے اسکولوں کا ایک خاندان۔'
    },
    'Connected Excellence': { ar: 'تميّز متصل', ur: 'جڑا ہوا کمال' },
    'Visit Main Portal': { ar: 'زيارة البوابة الرئيسية', ur: 'مین پورٹل دیکھیں' },
    'You are here': { ar: 'أنت هنا', ur: 'آپ یہاں ہیں' },
    'Coming soon': { ar: 'قريباً', ur: 'جلد آرہا ہے' },
    'Main': { ar: 'الرئيسي', ur: 'مین' },
    'Quick Portals': { ar: 'بوابات سريعة', ur: 'فوری پورٹلز' },
    'Parent Portal': { ar: 'بوابة أولياء الأمور', ur: 'پیرنٹ پورٹل' },
    'Student Portal': { ar: 'بوابة الطلاب', ur: 'اسٹوڈنٹ پورٹل' },
    'Staff Webmail': { ar: 'بريد الموظفين', ur: 'اسٹاف ویب میل' },
    'Home': { ar: 'الرئيسية', ur: 'ہوم' },
    'Admissions': { ar: 'القبول', ur: 'داخلہ' },
    'Academics': { ar: 'الأكاديميات', ur: 'تعلیم' },
    'Books': { ar: 'الكتب', ur: 'کتابیں' },
    'Student Life': { ar: 'حياة الطلاب', ur: 'طلبہ زندگی' },
    'Contact': { ar: 'اتصل بنا', ur: 'رابطہ' },
    'Portals': { ar: 'البوابات', ur: 'پورٹلز' },
    'Explore': { ar: 'استكشف', ur: 'دریافت' },
    'Resources': { ar: 'موارد', ur: 'وسائل' },
    'Contact Us': { ar: 'اتصل بنا', ur: 'رابطہ کریں' },
    'Privacy Policy': { ar: 'سياسة الخصوصية', ur: 'رازداری کی پالیسی' },
    'Terms of Service': { ar: 'شروط الخدمة', ur: 'شرائط و ضوابط' },
    'Track Application': { ar: 'تتبع الطلب', ur: 'درخواست ٹریک' },
    'Track Your Application': { ar: 'تتبع طلبك', ur: 'اپنی درخواست ٹریک کریں' },
    'Notices & Circulars': { ar: 'الإعلانات والتعاميم', ur: 'نوٹس اور سرکولر' },
    'Admissions Open for Academic Year 2025-26': {
      ar: 'القبول مفتوح للعام الدراسي 2025-26',
      ur: 'تعلیمی سال 2025-26 کے لیے داخلے کھلے ہیں'
    },
    'FBISE Board Examinations Schedule Released': {
      ar: 'صدر جدول امتحانات مجلس FBISE',
      ur: 'FBISE بورڈ امتحانات کا شیڈول جاری'
    },
    'Pakistan Day Celebrations – 23 March': {
      ar: 'احتفالات يوم باكستان – 23 مارس',
      ur: 'یوم پاکستان تقریبات – 23 مارچ'
    },
    'New STEM Lab Inauguration Coming Soon': {
      ar: 'افتتاح مختبر STEM قريباً',
      ur: 'نئی STEM لیب کا افتتاح جلد'
    },
    'Parent-Teacher Meeting – Register Online': {
      ar: 'اجتماع أولياء الأمور والمعلمين – سجّل عبر الإنترنت',
      ur: 'پیرنٹ ٹیچر میٹنگ – آن لائن رجسٹر'
    },
    'Admissions WhatsApp': { ar: 'واتساب القبول', ur: 'داخلہ واٹس ایپ' },
    'Skip to main content': { ar: 'تخطى إلى المحتوى الرئيسي', ur: 'مرکزی مواد پر جائیں' },
    'Core subjects mastery': { ar: 'إتقان المواد الأساسية', ur: 'بنیادی مضامین میں مہارت' },
    'Project-based learning': { ar: 'التعلم القائم على المشاريع', ur: 'پروجیکٹ پر مبنی سیکھنا' },
    'Sports & arts integration': { ar: 'دمج الرياضة والفنون', ur: 'کھیل اور فنون کا انضمام' },
    'Parent partnership': { ar: 'شراكة أولياء الأمور', ur: 'والدین کی شراکت' },
    'Subject specialists': { ar: 'متخصصو المواد', ur: 'مضامین کے ماہرین' },
    'STEM emphasis': { ar: 'تركيز STEM', ur: 'STEM پر زور' },
    'Clubs & societies': { ar: 'الأندية والجمعيات', ur: 'کلب اور سوسائٹیز' },
    'Career awareness': { ar: 'التوعية المهنية', ur: 'کیریئر آگاہی' },
    'Science & Arts groups': { ar: 'مجموعات العلوم والآداب', ur: 'سائنس اور آرٹس گروپس' },
    'Board examination focus': { ar: 'تركيز امتحانات المجلس', ur: 'بورڈ امتحان پر توجہ' },
    'Experienced subject specialists': { ar: 'متخصصون ذوو خبرة', ur: 'تجربہ کار ماہرین' },
    'Past paper & mock exams': { ar: 'أوراق سابقة واختبارات تجريبية', ur: 'گزشتہ پیپرز اور ماک امتحانات' },
    'In Stock': { ar: 'متوفر', ur: 'دستیاب' },
    'Low Stock': { ar: 'مخزون منخفض', ur: 'کم اسٹاک' },
    'Out of Stock': { ar: 'غير متوفر', ur: 'ختم' },
    'All': { ar: 'الكل', ur: 'سب' },
    'Uniforms': { ar: 'الزي المدرسي', ur: 'یونیفارم' },
    'Stationery': { ar: 'القرطاسية', ur: 'اسٹیشنری' },
    'Multi-Step Registration': { ar: 'تسجيل متعدد الخطوات', ur: 'کثیر مرحلہ رجسٹریشن' },
    'Student Bio': { ar: 'بيانات الطالب', ur: 'طالب علم کی معلومات' },
    'Guardian': { ar: 'ولي الأمر', ur: 'سرپرست' },
    'Records': { ar: 'السجلات', ur: 'ریکارڈز' },
    'Documents': { ar: 'المستندات', ur: 'دستاویزات' },
    'Review': { ar: 'مراجعة', ur: 'جائزہ' },
    'Fee Structure Calculator': { ar: 'حاسبة الرسوم', ur: 'فیس کیلکولیٹر' },
    'Application Status': { ar: 'حالة الطلب', ur: 'درخواست کی حیثیت' },
    'Campus Address': { ar: 'عنوان الحرم', ur: 'کیمپس پتہ' },
    'Phone': { ar: 'الهاتف', ur: 'فون' },
    'Email': { ar: 'البريد الإلكتروني', ur: 'ای میل' },
    'Visiting Hours': { ar: 'ساعات الزيارة', ur: 'ملاقات کے اوقات' },
    'Send an Inquiry': { ar: 'أرسل استفساراً', ur: 'استفسار بھیجیں' },
    'Find Us on the Map': { ar: 'موقعنا على الخريطة', ur: 'نقشے پر تلاش کریں' },
    'Books & Stock': { ar: 'الكتب والمخزون', ur: 'کتابیں اور اسٹاک' },
    'Student Life & Gallery': { ar: 'حياة الطلاب والمعرض', ur: 'طلبہ زندگی اور گیلری' },
    'Academics & Faculty': { ar: 'الأكاديميات وأعضاء هيئة التدريس', ur: 'تعلیم اور اساتذہ' },
    'Contact & Location': { ar: 'الاتصال والموقع', ur: 'رابطہ اور مقام' },
    'Sunday – Thursday': { ar: 'الأحد – الخميس', ur: 'اتوار – جمعرات' },
    'Light the Torch for Knowledge': { ar: 'أشعل شعلة المعرفة', ur: 'علم کی مشعل روشن کرو' },
    'Quick Links': { ar: 'روابط سريعة', ur: 'فوری لنکس' },
    'Academic Calendar': { ar: 'التقويم الأكاديمي', ur: 'تعلیمی کیلنڈر' },
    'Add to Calendar': { ar: 'أضف إلى التقويم', ur: 'کیلنڈر میں شامل کریں' },
    'View Details': { ar: 'عرض التفاصيل', ur: 'تفصیل دیکھیں' },
    'Submit Application': { ar: 'إرسال الطلب', ur: 'درخواست جمع کرائیں' },
    'Next': { ar: 'التالي', ur: 'اگلا' },
    'Back': { ar: 'رجوع', ur: 'پیچھے' },
    'Full Name': { ar: 'الاسم الكامل', ur: 'پورا نام' },
    'Date of Birth': { ar: 'تاريخ الميلاد', ur: 'تاریخ پیدائش' },
    'Gender': { ar: 'الجنس', ur: 'جنس' },
    'Male': { ar: 'ذكر', ur: 'مرد' },
    'Female': { ar: 'أنثى', ur: 'عورت' },
    'Nationality': { ar: 'الجنسية', ur: 'قومیت' },
    'Message': { ar: 'الرسالة', ur: 'پیغام' },
    'Send Message': { ar: 'إرسال', ur: 'بھیجیں' },
    'Subject': { ar: 'الموضوع', ur: 'موضوع' },
    'Your Name': { ar: 'اسمك', ur: 'آپ کا نام' },
    'Seeb': { ar: 'السيب', ur: 'سیب' },
    'Muscat': { ar: 'مسقط', ur: 'مسقط' },
    'Sohar': { ar: 'صحار', ur: 'صحار' },
    'Salalah': { ar: 'صلالة', ur: 'صلالہ' },
    'Nizwa': { ar: 'نزوى', ur: 'نزوی' },
    'Buraimi': { ar: 'البريمي', ur: 'بریمي' },
    'Musannah': { ar: 'المصنعة', ur: 'المصنعة' },
    'Mabelah': { ar: 'مبيلة', ur: 'مبیلہ' },
    'Fee Structure': { ar: 'هيكل الرسوم', ur: 'فیس کا ڈھانچہ' },
    'Your progress is saved automatically. Complete all steps to receive a tracking ID.': { ar: 'يُحفظ تقدمك تلقائياً. أكمل جميع الخطوات للحصول على رقم التتبع.', ur: 'آپ کی پیش رفت خودکار محفوظ ہوتی ہے۔ ٹریکنگ آئی ڈی کے لیے تمام مراحل مکمل کریں۔' },
    'Student Information': { ar: 'معلومات الطالب', ur: 'طالب علم کی معلومات' },
    'Guardian / Parent Details': { ar: 'بيانات ولي الأمر', ur: 'سرپرست / والدین کی تفصیلات' },
    'Previous School Records': { ar: 'سجلات المدرسة السابقة', ur: 'پچھلے اسکول کے ریکارڈ' },
    'Document Uploads': { ar: 'رفع المستندات', ur: 'دستاویزات اپلوڈ' },
    'Review & Submit': { ar: 'مراجعة وإرسال', ur: 'جائزہ اور جمع کرانا' },
    'Continue →': { ar: 'متابعة ←', ur: 'جاری رکھیں →' },
    '← Back': { ar: '→ رجوع', ur: '← پیچھے' },
    'Tracking ID': { ar: 'رقم التتبع', ur: 'ٹریکنگ آئی ڈی' },
    'Print Receipt': { ar: 'طباعة الإيصال', ur: 'رسید پرنٹ کریں' },
    'Pending Review': { ar: 'قيد المراجعة', ur: 'زیر جائزہ' },
    'Under Review': { ar: 'قيد المراجعة', ur: 'زیر جائزہ' },
    'Interview Scheduled': { ar: 'مقابلة مجدولة', ur: 'انٹرویو طے' },
    'Accepted': { ar: 'مقبول', ur: 'منظور' },
    'Waitlisted': { ar: 'قائمة الانتظار', ur: 'ویٹ لسٹ' },
    'Rejected': { ar: 'مرفوض', ur: 'مسترد' },
    'In stock': { ar: 'متوفر', ur: 'دستیاب' },
    'Low stock': { ar: 'مخزون منخفض', ur: 'کم اسٹاک' },
    'Out of stock': { ar: 'غير متوفر', ur: 'ختم' },
    'Any stock': { ar: 'أي حالة', ur: 'کوئی بھی' },
    'Book sets': { ar: 'مجموعات الكتب', ur: 'کتابوں کے سیٹ' },
    'Select Grade': { ar: 'اختر الصف', ur: 'جماعت منتخب کریں' },
    'Grade Level': { ar: 'المستوى الدراسي', ur: 'جماعت کی سطح' },
    'Billing Period': { ar: 'فترة الفوترة', ur: 'بلنگ مدت' },
    'Term 1': { ar: 'الفصل 1', ur: 'ٹرم 1' },
    'Term 2': { ar: 'الفصل 2', ur: 'ٹرم 2' },
    'Term 3': { ar: 'الفصل 3', ur: 'ٹرم 3' },
    'Monthly': { ar: 'شهري', ur: 'ماہانہ' },
    'Kindergarten': { ar: 'روضة', ur: 'کنڈرگارٹن' },
    'Emergency Contact': { ar: 'اتصال الطوارئ', ur: 'ہنگامی رابطہ' },
    'Email Address': { ar: 'البريد الإلكتروني', ur: 'ای میل پتہ' },
    'Mobile Number': { ar: 'رقم الجوال', ur: 'موبائل نمبر' },
    'General Inquiry': { ar: 'استفسار عام', ur: 'عام استفسار' },
    'Admission Related': { ar: 'متعلق بالقبول', ur: 'داخلہ سے متعلق' },
    'Fees & Payments': { ar: 'الرسوم والمدفوعات', ur: 'فیس اور ادائیگی' },
    'Academic Query': { ar: 'استفسار أكاديمي', ur: 'تعلیمی سوال' },
    'Campus Map': { ar: 'خريطة الحرم', ur: 'کیمپس کا نقشہ' },
    'Faculty Directory': { ar: 'دليل أعضاء هيئة التدريس', ur: 'اساتذہ ڈائریکٹری' },
    'Curriculum Pathways': { ar: 'مسارات المنهج', ur: 'نصاب کے راستے' },
    'FBISE Stream': { ar: 'مسار FBISE', ur: 'FBISE سلسلہ' },
    'Cambridge Stream': { ar: 'مسار كامبريدج', ur: 'کیمبرج سلسلہ' },
    'Junior Foundation': { ar: 'الأساس الابتدائي', ur: 'جونیئر فاؤنڈیشن' },
    'Clubs & Societies': { ar: 'الأندية والجمعيات', ur: 'کلب اور سوسائٹیز' },
    'Sports Club': { ar: 'النادي الرياضي', ur: 'سپورٹس کلب' },
    'Robotics & Coding': { ar: 'الروبوتات والبرمجة', ur: 'روبوٹکس اور کوڈنگ' },
    'Literary Society': { ar: 'الجمعية الأدبية', ur: 'ادبی سوسائٹی' },
    'Drama & Arts': { ar: 'المسرح والفنون', ur: 'ڈراما اور آرٹس' },
    'National Days': { ar: 'الأيام الوطنية', ur: 'قومی دن' },
    'Science Fairs': { ar: 'معارض العلوم', ur: 'سائنس میلے' },
    'Art & Culture': { ar: 'الفن والثقافة', ur: 'فن اور ثقافت' },
    'Admissions 2025–26': { ar: 'القبول 2025–26', ur: 'داخلہ 2025–26' },
    'Online Application': { ar: 'طلب عبر الإنترنت', ur: 'آن لائن درخواست' },
    'View Status': { ar: 'عرض الحالة', ur: 'حیثیت دیکھیں' },
    'Application ID': { ar: 'رقم الطلب', ur: 'درخواست آئی ڈی' },
    'Phone or Email': { ar: 'الهاتف أو البريد', ur: 'فون یا ای میل' },
    'All categories': { ar: 'كل الفئات', ur: 'تمام اقسام' },
    'Circulars': { ar: 'التعاميم', ur: 'سرکولر' },
    'Holidays': { ar: 'العطل', ur: 'چھٹیاں' },
    'Student LMS': { ar: 'نظام التعلم للطلاب', ur: 'اسٹوڈنٹ LMS' },
    'Main Website': { ar: 'الموقع الرئيسي', ur: 'مرکزی ویب سائٹ' },
    'Plan a Visit': { ar: 'خطط لزيارة', ur: 'دورے کی منصوبہ بندی' },
    'Since 2014': { ar: 'منذ 2014', ur: '2014 سے' },
    'Dual pathways': { ar: 'مساران', ur: 'دو راستے' },
    'STEM facilities': { ar: 'مرافق STEM', ur: 'STEM سہولیات' },
    'Science Labs': { ar: 'مختبرات العلوم', ur: 'سائنس لیبز' },
    'Library & ICT': { ar: 'المكتبة وتقنية المعلومات', ur: 'لائبریری اور ICT' },
    'Counseling support': { ar: 'دعم الإرشاد', ur: 'مشاورت کی مدد' },
    'No Transport': { ar: 'بدون نقل', ur: 'ٹرانسپورٹ نہیں' },
    'Bus Route': { ar: 'مسار الحافلة', ur: 'بس روٹ' },
    'Far Zone': { ar: 'منطقة بعيدة', ur: 'دور کا زون' },
    'Mid Zone': { ar: 'منطقة متوسطة', ur: 'درمیانی زون' },
    'Omani National': { ar: 'عماني الجنسية', ur: 'عمانی شہری' },
    'Relationship': { ar: 'صلة القرابة', ur: 'رشتہ' },
    'Father': { ar: 'الأب', ur: 'والد' },
    'Mother': { ar: 'الأم', ur: 'والدہ' },
    'Other': { ar: 'أخرى', ur: 'دیگر' },
    'Select': { ar: 'اختر', ur: 'منتخب کریں' },
    'Status': { ar: 'الحالة', ur: 'حیثیت' },
    'Note:': { ar: 'ملاحظة:', ur: 'نوٹ:' },
    'Follow': { ar: 'تابع', ur: 'فالو' },
    'People': { ar: 'أشخاص', ur: 'افراد' },
    'Updates': { ar: 'تحديثات', ur: 'اپ ڈیٹس' },
    'Calendar': { ar: 'التقويم', ur: 'کیلنڈر' },
    'Network': { ar: 'الشبكة', ur: 'نیٹ ورک' },
    'Languages': { ar: 'اللغات', ur: 'زبانیں' },
    'Website': { ar: 'الموقع', ur: 'ویب سائٹ' },
    'Hours': { ar: 'الساعات', ur: 'اوقات' },
    'Fees': { ar: 'الرسوم', ur: 'فیس' },
    'Exams': { ar: 'الامتحانات', ur: 'امتحانات' },
    'Student': { ar: 'طالب', ur: 'طالب علم' },
    'Done': { ar: 'تم', ur: 'مکمل' },
    'Loading notices…': { ar: 'جاري تحميل الإعلانات…', ur: 'نوٹس لوڈ ہو رہے ہیں…' },
    'Application Submitted!': { ar: 'تم إرسال الطلب!', ur: 'درخواست جمع ہو گئی!' },
    'We welcome your inquiries. Visit us in Al Seeb or reach out by phone, email or the form below.': { ar: 'نرحب باستفساراتكم. زورونا في السيب أو تواصلوا هاتفياً أو بالبريد أو عبر النموذج.', ur: 'ہم آپ کے سوالات کا خیر مقدم کرتے ہیں۔ ال سیب آئیں یا فون، ای میل یا فارم سے رابطہ کریں۔' },
    'Moments of learning, celebration, sport and creativity from the Pakistan School Seeb community.': { ar: 'لحظات من التعلم والاحتفال والرياضة والإبداع من مجتمع مدرسة باكستان السيب.', ur: 'پاکستان سکول سیب کمیونٹی سے سیکھنے، جشن، کھیل اور تخلیق کے لمحے۔' },
    'Begin your child\'s journey at Pakistan School Seeb. Complete the online application in a few simple steps.': { ar: 'ابدأ رحلة طفلك في مدرسة باكستان السيب. أكمل الطلب عبر الإنترنت بخطوات بسيطة.', ur: 'پاکستان سکول سیب میں اپنے بچے کا سفر شروع کریں۔ چند آسان مراحل میں آن لائن درخواست مکمل کریں۔' },
    'Pakistan School Seeb is proudly part of the Pakistan Schools Oman network, operating under a unified Board of Directors elected by parents and supervised by the Ministry of Education.': { ar: 'مدرسة باكستان السيب جزء فخور من شبكة مدارس باكستان عمان، تحت مجلس إدارة موحّد ينتخبه أولياء الأمور وبإشراف وزارة التربية.', ur: 'پاکستان سکول سیب فخر سے پاکستان سکولز عمان نیٹ ورک کا حصہ ہے، والدین کے منتخب بورڈ اور وزارت تعلیم کی نگرانی میں۔' },
    'Shared academic standards & best practices': { ar: 'معايير أكاديمية مشتركة وأفضل الممارسات', ur: 'مشترکہ تعلیمی معیارات اور بہترین طریقے' },
    'Inter-branch sports & cultural events': { ar: 'فعاليات رياضية وثقافية بين الفروع', ur: 'برانچز کے درمیان کھیل و ثقافتی تقریبات' },
    'Professional development for faculty': { ar: 'تطوير مهني لأعضاء هيئة التدريس', ur: 'اساتذہ کی پیشہ ورانہ ترقی' },
    'Expanding with new Mabelah campus': { ar: 'التوسع بحرم مبيلة الجديد', ur: 'نئے مبیلہ کیمپس کے ساتھ توسیع' },
    'Seeb — our campus in Al Seeb, Muscat. Over 1,300 students, FBISE & Cambridge pathways, KG–Grade 12.': { ar: 'السيب — حرمنا في السيب، مسقط. أكثر من 1300 طالب، مسارا FBISE وكامبريدج، من الروضة إلى الصف 12.', ur: 'سیب — ال سیب، مسقط میں ہمارا کیمپس۔ 1300+ طلبہ، FBISE و کیمبرج، KG تا گریڈ 12۔' },
    'Official email': { ar: 'البريد الرسمي', ur: 'سرکاری ای میل' },
    'Flags & reception': { ar: 'الأعلام والاستقبال', ur: 'جھنڈے اور استقبالیہ' },
    'Main Entrance': { ar: 'المدخل الرئيسي', ur: 'مرکزی دروازہ' },
    'Priority: High': { ar: 'أولوية: عالية', ur: 'ترجیح: اعلیٰ' },
    'Explore Academics': { ar: 'استكشف الأكاديميات', ur: 'تعلیم دیکھیں' },
    'Full set': { ar: 'المجموعة كاملة', ur: 'مکمل سیٹ' },
    'Uniforms & Stationery': { ar: 'الزي والقرطاسية', ur: 'یونیفارم اور اسٹیشنری' }
  };

  // Any string used as a data-i18n value should also be catchable by the
  // free-text phrase walk below, so dynamically-rendered copy that reuses
  // the same English wording (e.g. stock badges, cards built from data.json)
  // gets translated too, not just elements explicitly tagged with data-i18n.
  Object.keys(STRINGS.en).forEach((key) => {
    const enVal = STRINGS.en[key];
    if (enVal && !PHRASES[enVal]) {
      PHRASES[enVal] = { ar: STRINGS.ar[key], ur: STRINGS.ur[key] };
    }
  });

  // Sort longest phrases first for replace
  const PHRASE_KEYS = Object.keys(PHRASES).sort((a, b) => b.length - a.length);

  const RTL = { ar: true, ur: true, en: false };

  function getLang() {
    return localStorage.getItem('pss-lang') || 'en';
  }

  function setLang(lang) {
    if (!STRINGS[lang]) lang = 'en';
    localStorage.setItem('pss-lang', lang);
    document.documentElement.lang = lang === 'ar' ? 'ar' : lang === 'ur' ? 'ur' : 'en';
    document.documentElement.dir = RTL[lang] ? 'rtl' : 'ltr';
    apply(lang);
    document.querySelectorAll('.lang-switch button').forEach((b) => {
      b.classList.toggle('active', b.dataset.lang === lang);
    });
  }

  function translatePhrase(english, lang) {
    if (lang === 'en' || !english) return english;
    const hit = PHRASES[english];
    if (hit && hit[lang]) return hit[lang];
    // partial: try trim
    const t = english.trim();
    if (PHRASES[t] && PHRASES[t][lang]) return PHRASES[t][lang];
    return english;
  }

  function walkTextNodes(root, lang) {
    const skip = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'CODE', 'PRE']);
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const p = node.parentElement;
        if (!p || skip.has(p.tagName)) return NodeFilter.FILTER_REJECT;
        if (p.closest('[data-no-i18n],.lang-switch,input,textarea,select')) {
          return NodeFilter.FILTER_REJECT;
        }
        if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => {
      const parent = node.parentElement;
      if (!parent) return;
      // Store original once
      if (!parent.hasAttribute('data-pss-en') && parent.childNodes.length === 1) {
        parent.setAttribute('data-pss-en', node.nodeValue);
      }
      const original =
        parent.getAttribute('data-pss-en') ||
        (parent.childNodes.length === 1 ? node.nodeValue : null);
      if (!original) return;
      // For simple single-text elements, full phrase replace
      if (parent.childNodes.length === 1) {
        const tr = translatePhrase(original.trim(), lang);
        if (lang === 'en') {
          node.nodeValue = original;
        } else if (tr !== original.trim()) {
          // preserve surrounding whitespace pattern
          node.nodeValue = original.replace(original.trim(), tr);
        } else {
          // try multi-phrase inside longer text
          let text = original;
          PHRASE_KEYS.forEach((en) => {
            if (text.includes(en) && PHRASES[en][lang]) {
              text = text.split(en).join(PHRASES[en][lang]);
            }
          });
          node.nodeValue = text;
        }
      }
    });
  }

  function apply(lang) {
    // Disconnect while we make our own DOM changes, so we don't react to
    // our own translation writes (which would otherwise loop forever).
    if (domObserver) domObserver.disconnect();

    const dict = STRINGS[lang] || STRINGS.en;

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      const target =
        el.querySelector('.nav-apply-label, .section-button__title, [data-i18n-text]') || el;
      if (!el.hasAttribute('data-pss-en')) {
        el.setAttribute('data-pss-en', (target.textContent || el.textContent || '').trim());
      }
      const val = dict[key] || (lang === 'en' ? el.getAttribute('data-pss-en') : null);
      if (val) target.textContent = val;
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (dict[key]) el.setAttribute('placeholder', dict[key]);
    });

    // Full page phrase walk (main content + nav + footer)
    walkTextNodes(document.body, lang);

    // Font for RTL scripts
    if (lang === 'ar') {
      document.body.style.fontFamily =
        "'Noto Naskh Arabic','Noto Sans Arabic',Inter,Tahoma,sans-serif";
    } else if (lang === 'ur') {
      document.body.style.fontFamily =
        "'Noto Nastaliq Urdu','Noto Naskh Arabic',Inter,Tahoma,sans-serif";
    } else {
      document.body.style.fontFamily = '';
    }

    if (domObserver) domObserver.observe(document.body, { childList: true, subtree: true });
  }

  // ----- Auto re-translate content that loads or changes after page load -----
  // The site pulls a lot of content in asynchronously after i18n's first pass
  // (book listings, notices, homepage stats/ticker from data/content.json,
  // chatbot replies, admin-published edits). Without this, switching language
  // only affected whatever happened to already be in the DOM at that instant.
  let domObserver = null;
  let reapplyTimer = null;
  function scheduleReapply() {
    clearTimeout(reapplyTimer);
    reapplyTimer = setTimeout(() => {
      const lang = getLang();
      if (lang !== 'en') apply(lang);
    }, 150);
  }
  function startObserving() {
    domObserver = new MutationObserver(scheduleReapply);
    domObserver.observe(document.body, { childList: true, subtree: true });
  }

  function injectSwitcher() {
    const actions = document.querySelector('.nav-actions');
    // Only skip if navbar already has a switcher (ignore mobile-nav copy)
    if (actions && !actions.querySelector('.lang-switch')) {
      const wrap = document.createElement('div');
      wrap.className = 'lang-switch';
      wrap.setAttribute('role', 'group');
      wrap.setAttribute('aria-label', 'Language');
      wrap.innerHTML = `
        <button type="button" data-lang="en" title="English">EN</button>
        <button type="button" data-lang="ar" title="العربية">ع</button>
        <button type="button" data-lang="ur" title="اردو">اردو</button>
      `;
      actions.insertBefore(wrap, actions.firstChild);
    }
  }

  function bindLangButtons() {
    document.querySelectorAll('.lang-switch button[data-lang]').forEach((b) => {
      if (b.dataset.boundLang === '1') return;
      b.dataset.boundLang = '1';
      b.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        const lang = b.getAttribute('data-lang');
        if (lang) setLang(lang);
        // Close mobile drawer after language change on phone
        const mobile = document.getElementById('mobile-nav');
        const toggle = document.getElementById('menu-toggle');
        if (mobile && mobile.classList.contains('open')) {
          mobile.classList.remove('open');
          if (toggle) toggle.setAttribute('aria-expanded', 'false');
          document.body.classList.remove('nav-open');
        }
      });
    });
  }

  function boot() {
    injectSwitcher();
    bindLangButtons();
    setLang(getLang());
    startObserving();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  window.PSS_I18N = { setLang, getLang, STRINGS, PHRASES, apply, refresh: () => apply(getLang()) };
})();
