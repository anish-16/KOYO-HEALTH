import type { BlogPost } from './types';

export const blogs: BlogPost[] = [
  {
    slug: 'annual-checkup-that-predicts-disease',
    title: 'The 40-minute annual checkup that actually predicts disease',
    excerpt:
      'Most annual "full body" packages measure 80 things and explain none. Here is the smaller, smarter panel that changes outcomes.',
    category: 'Preventive Care',
    author: 'Dr. Ananya Rao',
    authorRole: 'Internal Medicine, 14 years',
    date: '2026-10-28',
    readTime: 7,
    heroTone: 'teal',
    sections: [
      {
        heading: 'More tests is not the same as better testing',
        body: [
          'A 96-parameter panel looks impressive on a brochure. But parameters are not decisions. What changes your life is a small set of measurements with clear thresholds and clear actions: blood pressure, HbA1c, LDL and ApoB, kidney filtration, liver enzymes, haemoglobin, and a conversation about sleep and smoking.',
          'Everything else should be added because of your age, family history or symptoms — not because it fits on a discount card. A good annual checkup is a clinical interview with labs attached, not a lab report with a greeting.',
        ],
        list: [
          'Blood pressure, measured twice, seated, both arms',
          'HbA1c and fasting glucose',
          'Lipid profile with ApoB where available',
          'eGFR and urine albumin-to-creatinine ratio',
          'CBC with ferritin for menstruating adults',
        ],
      },
      {
        heading: 'The three numbers people ignore',
        body: [
          'In our review of 12,400 annual reports, the three most commonly ignored abnormal values were ferritin, urine albumin and ApoB. All three are silent, all three are treatable, and all three predict problems a decade out.',
          'Ferritin below 30 ng/mL causes fatigue and hair fall long before haemoglobin drops. Urine albumin above 30 mg/g signals kidney strain in diabetes years before creatinine moves. ApoB tracks the number of atherogenic particles better than LDL alone, especially when triglycerides are high.',
        ],
      },
      {
        heading: 'What to do with a borderline result',
        body: [
          'Borderline results are not a reason to panic or to repeat the test next week. They are a reason to establish a baseline and recheck in three to six months after a specific change. Repeating a test without changing anything simply buys the same number twice.',
          'Bring your report to a physician with context: what you eat, how you sleep, what runs in your family, what medicines you take. The number is half the story; the context decides the plan.',
        ],
      },
      {
        heading: 'A realistic annual rhythm',
        body: [
          'For most adults under 40 with no risk factors, an annual visit with basic metabolic and lipid testing is enough. After 40, add a cardiac risk assessment and age-appropriate cancer screening. After 50, bone density and colorectal screening enter the picture.',
          'The best checkup is the one you will repeat. Choose a time of year you will remember, book it with the same lab so trends are comparable, and keep the report where you can find it. Consistency beats intensity.',
        ],
      },
    ],
    takeaways: [
      'A small, well-chosen panel beats a 100-parameter brochure.',
      'Ferritin, urine albumin and ApoB are the most under-treated abnormal values.',
      'Recheck after a change, not on a whim.',
    ],
  },
  {
    slug: 'mri-vs-ct-which-scan',
    title: 'MRI vs CT: which scan do you actually need?',
    excerpt:
      'Both see inside the body, but they answer different questions. A radiologist explains how clinicians choose.',
    category: 'Imaging',
    author: 'Dr. Vikram Sethi',
    authorRole: 'Consultant Radiologist, 18 years',
    date: '2026-10-19',
    readTime: 6,
    heroTone: 'ink',
    sections: [
      {
        heading: 'The one-line difference',
        body: [
          'CT uses X-rays and is excellent for bone, lung and speed. MRI uses a magnetic field and is excellent for soft tissue, nerves and joints. If the question is "is there a fracture or a bleed?", CT usually wins. If the question is "what is happening in this ligament, nerve or spinal cord?", MRI wins.',
          'Neither is "better". A scan is a tool chosen for a question, and the same patient may need both at different points in an illness.',
        ],
      },
      {
        heading: 'When CT is the right call',
        body: [
          'CT is the workhorse of emergency medicine because it is fast and available. A head injury, suspected kidney stone, acute abdominal pain, pulmonary embolism or staging of a known cancer are all classic CT questions.',
          'Modern low-dose protocols have cut radiation substantially, and every KOYO CT records the dose delivered. For a single clinically justified study, the risk is small compared with the risk of missing the diagnosis.',
        ],
        list: ['Head injury and stroke triage', 'Kidney and ureteric stones', 'Lung nodules and HRCT', 'Cancer staging', 'Complex fractures'],
      },
      {
        heading: 'When MRI is worth the wait',
        body: [
          'MRI takes longer and costs more, but it resolves things CT cannot: a torn ACL, a herniated disc pressing on a nerve, early bone marrow changes, or a subtle brain lesion. It also avoids ionising radiation, which matters for children and for repeat follow-up.',
          'The trade-offs are real: MRI is noisy, requires stillness, and is unsafe with some implants. Always declare pacemakers, cochlear implants, aneurysm clips and metallic fragments before entering the scan room.',
        ],
      },
      {
        heading: 'What to ask before you book',
        body: [
          'Ask three questions: What question is this scan answering? Is there a cheaper or safer test that answers it? And who will compare it with my previous imaging? The third question is the one patients forget, and the one that most changes the report.',
          'If you have prior films, bring them. Comparison turns a descriptive report into a clinically useful one.',
        ],
      },
    ],
    takeaways: [
      'CT for speed, bone and lung; MRI for soft tissue, nerves and joints.',
      'Bring prior imaging — comparison changes the interpretation.',
      'Declare implants and pregnancy before any scan.',
    ],
  },
  {
    slug: 'hba1c-explained',
    title: 'HbA1c explained: the number that predicts your next decade',
    excerpt:
      'A single blood test averages three months of blood sugar. Here is how to read it, and what to do at every threshold.',
    category: 'Diabetes',
    author: 'Dr. Meera Krishnan',
    authorRole: 'Endocrinology, 11 years',
    date: '2026-10-11',
    readTime: 6,
    heroTone: 'gold',
    sections: [
      {
        heading: 'What HbA1c actually measures',
        body: [
          'Glucose sticks to haemoglobin in proportion to how much sugar has been in your blood. Because red cells live about three months, HbA1c reflects that window rather than a single morning.',
          'That is why one high reading after a festival does not define your diabetes, and one good fasting value does not rule it out. HbA1c smooths the noise.',
        ],
      },
      {
        heading: 'The thresholds that matter',
        body: [
          'Below 5.7% is normal. Between 5.7% and 6.4% is pre-diabetes. At 6.5% or above, diabetes is diagnosed if confirmed. For someone already treated, the target is usually below 7%, relaxed for the elderly or frail and tightened in pregnancy.',
          'These are population thresholds, not destiny. Two people with the same HbA1c can have very different risks depending on blood pressure, lipids, kidney function and smoking.',
        ],
        list: ['< 5.7% — normal', '5.7–6.4% — pre-diabetes', '≥ 6.5% — diabetes (confirm)', '< 7% — usual treatment target'],
      },
      {
        heading: 'Why it can mislead',
        body: [
          'Anaemia, recent blood loss, pregnancy, thalassaemia and some haemoglobin variants distort HbA1c. If your HbA1c does not match your glucose readings, ask for a fructosamine or continuous glucose monitor.',
          'It also hides variability. Two people at 7% can have wildly different days — one steady, one with dangerous lows and highs. A CGM tells that story; HbA1c does not.',
        ],
      },
      {
        heading: 'What actually lowers it',
        body: [
          'In pre-diabetes, 7% body-weight loss and 150 minutes of weekly activity reduce progression by more than half — more than most medications achieve at that stage. In established diabetes, medication plus the same basics is the combination that works.',
          'Recheck every three months until stable, then every six. Track the number alongside weight, waist and blood pressure; the trend is the treatment.',
        ],
      },
    ],
    takeaways: [
      'HbA1c is a three-month average, not a daily verdict.',
      'Anaemia and haemoglobin variants can falsify the result.',
      'Pre-diabetes is reversible with modest, sustained changes.',
    ],
  },
  {
    slug: 'vitamin-d-deficiency-india',
    title: 'Why your Vitamin D is low even in sunny India',
    excerpt:
      'Skin tone, indoor work, sunscreen and pollution all conspire against synthesis. What to test, and what to take.',
    category: 'Nutrition',
    author: 'Dr. Ananya Rao',
    authorRole: 'Internal Medicine, 14 years',
    date: '2026-10-02',
    readTime: 5,
    heroTone: 'gold',
    sections: [
      {
        heading: 'Sunshine is not the same as synthesis',
        body: [
          'Vitamin D is made when UVB light reaches the skin. In India, most office workers are indoors during the hours when UVB is strongest, and when they do go out they are covered or sun-screened. Add darker skin (which needs longer exposure) and winter haze, and deficiency becomes the norm rather than the exception.',
          'Studies across Indian cities consistently find 50–90% of adults below sufficiency, including people who spend time outdoors.',
        ],
      },
      {
        heading: 'How to test properly',
        body: [
          'Ask for 25-hydroxy Vitamin D, not the active 1,25 form. The 25-OH level reflects stores. Thresholds vary by lab, but generally below 20 ng/mL is deficient, 20–30 insufficient, and 30–60 sufficient.',
          'Test before you supplement, then recheck after 12 weeks. Without a baseline you cannot tell whether the dose worked.',
        ],
      },
      {
        heading: 'Correcting it',
        body: [
          'Deficiency is usually corrected with a supervised high-dose course for 6–8 weeks, followed by a maintenance dose. Daily dosing is better tolerated than giant occasional doses, and taking it with a fat-containing meal improves absorption.',
          'Do not stack multiple supplements that each contain Vitamin D. Toxicity is rare but real, and it happens when people combine products without reading labels.',
        ],
      },
      {
        heading: 'The parts sunshine cannot fix',
        body: [
          'Vitamin D supports calcium absorption and bone health, but it is not a cure for fatigue, hair fall or immunity on its own. If those are your symptoms, test ferritin, B12 and thyroid too — deficiency clusters are common.',
          'Treat the deficiency you have measured, not the one you assume.',
        ],
      },
    ],
    takeaways: [
      'Ask for 25-OH Vitamin D, not the active form.',
      'Recheck 12 weeks after starting treatment.',
      'Check ferritin, B12 and thyroid alongside it.',
    ],
  },
  {
    slug: 'chest-pain-when-to-worry',
    title: 'Chest pain at 3 am: when to wait, when to call an ambulance',
    excerpt:
      'A cardiologist on the symptoms that demand immediate help, the ones that can wait for morning, and the tests that sort them out.',
    category: 'Heart Health',
    author: 'Dr. Arjun Malhotra',
    authorRole: 'Interventional Cardiology, 16 years',
    date: '2026-09-24',
    readTime: 6,
    heroTone: 'clay',
    sections: [
      {
        heading: 'Call for help now if…',
        body: [
          'Crushing central chest pain lasting more than 15 minutes, pain spreading to the jaw or left arm, cold sweat, nausea, or breathlessness at rest are emergency symptoms. Do not drive yourself and do not wait to see whether it passes.',
          'In women, the elderly and people with diabetes, the presentation can be subtler: unexplained fatigue, indigestion-like discomfort, or isolated breathlessness. A low threshold for help is not overcaution — it is good judgement.',
        ],
        list: [
          'Central pressure lasting over 15 minutes',
          'Pain radiating to jaw, neck or arm',
          'Cold sweat with nausea',
          'Fainting or near-fainting',
          'Breathlessness at rest',
        ],
      },
      {
        heading: 'What can usually wait for morning',
        body: [
          'Sharp pain that worsens when you press the spot, changes with posture, or follows a coughing illness is more often musculoskeletal. Brief stabbing pains that last seconds are rarely cardiac. Reflux often burns after meals and improves with antacids.',
          'That said, "usually" is doing a lot of work in that sentence. If you have risk factors and are unsure, get evaluated. The cost of a normal ECG is far lower than the cost of a missed event.',
        ],
      },
      {
        heading: 'The tests that sort it out',
        body: [
          'An ECG within ten minutes is the first step. Troponin levels over a few hours detect heart-muscle injury. An echocardiogram shows pumping function and wall motion. A treadmill test or CT coronary angiography answers the question of stable blockage.',
          'No single test rules everything out. The combination of history, ECG and troponin is what clinicians actually use.',
        ],
      },
      {
        heading: 'Prevention beats triage',
        body: [
          'The people who end up in a cath lab at 3 am are often the people who skipped three annual checkups. Blood pressure, ApoB, HbA1c, smoking and waist circumference explain most premature cardiac risk.',
          'You cannot change your genes. You can change five of those six.',
        ],
      },
    ],
    takeaways: [
      'Chest pressure with sweating or radiation is an emergency.',
      'ECG plus troponin is the initial rule-out, not a single test.',
      'Annual blood pressure and lipid checks are the real prevention.',
    ],
  },
  {
    slug: 'mammogram-after-40',
    title: 'The mammogram conversation every woman over 40 should have',
    excerpt:
      'When to start, how often, what 3D adds, and why dense breasts change the plan.',
    category: "Women's Health",
    author: 'Dr. Sneha Kapoor',
    authorRole: 'Breast Imaging & Gynaecology, 12 years',
    date: '2026-09-15',
    readTime: 7,
    heroTone: 'mauve',
    sections: [
      {
        heading: 'Start at 40, not when you feel a lump',
        body: [
          'Screening is designed to find cancer before it is palpable. For average-risk women, major guidelines converge on starting at 40 and screening every one to two years. Waiting for a symptom defeats the purpose of screening.',
          'If a first-degree relative had breast cancer, start ten years before their age at diagnosis — or at 30, whichever is later — and discuss genetic testing if several relatives are affected.',
        ],
      },
      {
        heading: 'What 3D adds',
        body: [
          'Tomosynthesis takes multiple angled images and reconstructs thin slices. In dense breast tissue, that reduces the chance of a cancer hiding behind normal tissue and lowers false callbacks.',
          'It is not necessary for everyone. For fatty breasts, 2D digital mammography is usually sufficient. For dense breasts, 3D plus ultrasound is a stronger combination.',
        ],
      },
      {
        heading: 'Dense breasts: what the report means',
        body: [
          'Breast density is reported as A to D. At C or D, mammography alone is less sensitive, and supplemental ultrasound or MRI is often advised. Density is not itself a diagnosis, but it is a risk factor and a technical limitation.',
          'Ask specifically: "What is my breast density, and does it change what I should do next?" That one question prevents a lot of confusion.',
        ],
      },
      {
        heading: 'The anxiety problem',
        body: [
          'False positives are the main harm of screening: an abnormal call leads to extra imaging, sometimes a biopsy, and often a benign result. It is frightening, and it is common.',
          'The antidote is preparation. Know that 1 in 10 screening mammograms needs extra views, that most of those turn out benign, and that same-day ultrasound at the same centre shortens the waiting — which is often worse than the result.',
        ],
      },
    ],
    takeaways: [
      'Start screening at 40 if average risk; earlier with family history.',
      '3D mammography helps most in dense breasts.',
      'Ask for your breast density grade and what it implies.',
    ],
  },
  {
    slug: 'sleep-apnoea-resistant-hypertension',
    title: 'Sleep apnoea: the silent condition behind resistant hypertension',
    excerpt:
      'Loud snoring and daytime sleepiness are not personality traits. They are symptoms of a treatable disease.',
    category: 'Sleep',
    author: 'Dr. Rohan Iyer',
    authorRole: 'Pulmonology & Sleep Medicine, 13 years',
    date: '2026-09-06',
    readTime: 6,
    heroTone: 'ink',
    sections: [
      {
        heading: 'What happens while you sleep',
        body: [
          'In obstructive sleep apnoea, the upper airway collapses repeatedly. Oxygen falls, the brain briefly wakes to reopen it, and the cycle repeats — sometimes hundreds of times a night, without the person remembering any of it.',
          'The consequences are not just tiredness. Each pause triggers a surge of adrenaline and a spike in blood pressure. Over years, that contributes to hypertension, atrial fibrillation, stroke and poor glucose control.',
        ],
      },
      {
        heading: 'Signs worth testing',
        body: [
          'Loud snoring, witnessed pauses, waking with a dry mouth or headache, and falling asleep during meetings or movies are classic. Resistant hypertension — needing three medicines and still uncontrolled — is a strong reason to test.',
          'Children can present differently: mouth breathing, poor school performance and bedwetting. Enlarged tonsils are a common cause.',
        ],
        list: ['Loud, habitual snoring', 'Witnessed breathing pauses', 'Morning headaches', 'Daytime sleepiness', 'Resistant hypertension'],
      },
      {
        heading: 'Home test or lab study?',
        body: [
          'A home sleep apnoea test measures breathing, oxygen and effort over one night in your own bed. It is comfortable and adequate for straightforward suspected OSA.',
          'Lab polysomnography adds EEG, eye movements and limb leads, which is necessary for complex cases, children, suspected central apnoea, and CPAP titration.',
        ],
      },
      {
        heading: 'Treatment that works',
        body: [
          'CPAP remains the most effective treatment for moderate to severe OSA. Weight loss, positional therapy, and mandibular advancement devices help selected patients. Alcohol and sedatives worsen airway collapse and should be minimised.',
          'Treatment is not cosmetic. Studies show meaningful improvements in blood pressure, daytime alertness and driving safety within months.',
        ],
      },
    ],
    takeaways: [
      'Snoring plus daytime sleepiness deserves a sleep study.',
      'OSA is a common cause of resistant hypertension.',
      'Home testing is adequate for most straightforward cases.',
    ],
  },
  {
    slug: 'lipid-profile-beyond-ldl',
    title: 'Understanding your lipid profile beyond LDL',
    excerpt:
      'ApoB, triglycerides, HDL and the ratio that cardiologists actually watch.',
    category: 'Heart Health',
    author: 'Dr. Arjun Malhotra',
    authorRole: 'Interventional Cardiology, 16 years',
    date: '2026-08-29',
    readTime: 5,
    heroTone: 'clay',
    sections: [
      {
        heading: 'LDL is a good start, not the whole story',
        body: [
          'LDL cholesterol is the number most reports highlight, and it matters. But LDL is a measure of cholesterol mass, not particle number. Two people with the same LDL can have very different numbers of atherogenic particles.',
          'ApoB counts those particles directly. When triglycerides are high or HDL is low, ApoB often reveals risk that LDL underestimates.',
        ],
      },
      {
        heading: 'The triglyceride trap',
        body: [
          'Triglycerides rise with refined carbohydrates, alcohol, poor sleep and insulin resistance. A value above 150 mg/dL should prompt a look at fasting glucose and waist circumference, not just a statin conversation.',
          'Very high triglycerides (above 500) carry a pancreatitis risk and need specific treatment, including dietary fat restriction and medication.',
        ],
      },
      {
        heading: 'What actually moves the numbers',
        body: [
          'Saturated fat reduction, soluble fibre, regular aerobic exercise and weight loss move LDL modestly. Statins move it substantially and reduce events. For familial hypercholesterolaemia, medication is not optional lifestyle advice — it is the difference between a heart attack at 45 and not.',
          'Repeat lipids 8–12 weeks after a change. Earlier rechecks mostly measure noise.',
        ],
      },
      {
        heading: 'A practical target',
        body: [
          'For primary prevention, aim for LDL below 100 mg/dL and ApoB below 90 mg/dL. With established heart disease or diabetes, targets are lower: LDL below 70, sometimes below 55.',
          'Discuss the target with your physician, write it down, and track it. A number without a target is just a fact.',
        ],
      },
    ],
    takeaways: [
      'ApoB can reveal risk that LDL hides.',
      'High triglycerides warrant a metabolic workup.',
      'Know your personal LDL and ApoB targets.',
    ],
  },
  {
    slug: 'fatty-liver-reversible',
    title: 'Fatty liver is reversible — here is the window',
    excerpt:
      'Liver fat can clear in months. Fibrosis cannot. The scan that tells you which stage you are in.',
    category: 'Liver Health',
    author: 'Dr. Meera Krishnan',
    authorRole: 'Endocrinology, 11 years',
    date: '2026-08-20',
    readTime: 6,
    heroTone: 'gold',
    sections: [
      {
        heading: 'The spectrum nobody explains',
        body: [
          'Fatty liver is not one condition. It starts as simple steatosis, which is reversible. It can progress to inflammation (steatohepatitis), then fibrosis, then cirrhosis. Symptoms often appear only at the late stages, which is why silent cases matter.',
          'The good news: the early stages respond to weight loss, and the response is measurable.',
        ],
      },
      {
        heading: 'How to stage it without a biopsy',
        body: [
          'An ultrasound detects fat but not fibrosis. FibroScan measures liver stiffness, which correlates with fibrosis, and CAP score, which estimates fat. Together they separate "fatty but flexible" from "stiff and scarring".',
          'Blood-based indices (FIB-4, NFS) are a useful first screen. Imaging confirms. Biopsy is reserved for ambiguous cases.',
        ],
      },
      {
        heading: 'The weight-loss window',
        body: [
          'Losing 5% of body weight reduces liver fat. Losing 7–10% reduces inflammation. Losing more than 10% can regress fibrosis. These are not vague lifestyle platitudes; they are measured thresholds from trials.',
          'The type of diet matters less than adherence. Mediterranean-style eating, reduced fructose, no alcohol, and resistance training all help. Rapid crash diets can transiently worsen inflammation — slow and steady wins.',
        ],
      },
      {
        heading: 'What to monitor',
        body: [
          'Repeat LFTs every 3–6 months and FibroScan every 12 months while losing weight. Track fasting glucose, triglycerides and waist circumference — they move with liver fat.',
          'If fibrosis is already advanced, see a hepatologist. Surveillance for varices and liver cancer becomes part of the plan.',
        ],
      },
    ],
    takeaways: [
      'Steatosis is reversible; fibrosis is not — find your stage early.',
      'FibroScan measures stiffness and fat without a needle.',
      '10% weight loss can regress fibrosis.',
    ],
  },
  {
    slug: 'iron-deficiency-without-anaemia',
    title: 'Iron deficiency without anaemia is real',
    excerpt:
      'You can have normal haemoglobin and still be iron deficient. Ferritin is the number to ask for.',
    category: 'Lab Science',
    author: 'Dr. Sneha Kapoor',
    authorRole: 'Breast Imaging & Gynaecology, 12 years',
    date: '2026-08-11',
    readTime: 5,
    heroTone: 'teal',
    sections: [
      {
        heading: 'Haemoglobin is the last thing to fall',
        body: [
          'Iron is used to make haemoglobin, but the body prioritises red cells over stores. That means ferritin — the storage protein — drops first, while haemoglobin stays normal for months.',
          'By the time anaemia appears, stores are usually severely depleted. Waiting for low haemoglobin means waiting too long.',
        ],
      },
      {
        heading: 'Symptoms that get dismissed',
        body: [
          'Fatigue, hair fall, restless legs, breathlessness on stairs, cold intolerance, unusual cravings for ice, and reduced exercise tolerance are all consistent with low iron. They are also easy to attribute to stress or a busy week.',
          'In menstruating women, the most common cause is blood loss. In men and postmenopausal women, iron deficiency requires a search for gastrointestinal loss — it is not assumed to be dietary.',
        ],
      },
      {
        heading: 'Reading ferritin correctly',
        body: [
          'Ferritin below 30 ng/mL indicates deficiency in most adults. Between 30 and 50 with symptoms, a trial of iron and a recheck can be diagnostic. Ferritin is also an acute-phase reactant, so inflammation can falsely raise it.',
          'Pair ferritin with CRP when inflammation is suspected, and with transferrin saturation for a fuller picture.',
        ],
      },
      {
        heading: 'Treating it properly',
        body: [
          'Oral iron taken every other day improves absorption and reduces side effects compared with daily dosing. Vitamin C helps; tea, coffee and calcium supplements close to the dose hinder absorption.',
          'Recheck ferritin after three months. If it has not risen, look for ongoing loss, malabsorption or adherence problems before escalating to intravenous iron.',
        ],
      },
    ],
    takeaways: [
      'Ferritin falls before haemoglobin — test it directly.',
      'Men with iron deficiency need GI evaluation.',
      'Alternate-day oral iron is better absorbed and tolerated.',
    ],
  },
  {
    slug: 'what-whole-body-checkup-cannot-tell',
    title: 'What a whole-body checkup can and cannot tell you',
    excerpt:
      'Screening finds real disease, but it also finds things that would never have hurt you. Here is how to think about both.',
    category: 'Preventive Care',
    author: 'Dr. Vikram Sethi',
    authorRole: 'Consultant Radiologist, 18 years',
    date: '2026-08-02',
    readTime: 7,
    heroTone: 'ink',
    sections: [
      {
        heading: 'The real benefits',
        body: [
          'A well-designed checkup detects silent killers early: high blood pressure, diabetes, chronic kidney disease, anaemia, hepatitis, and several cancers. For these, early treatment measurably improves outcomes.',
          'It also creates a baseline. Knowing your normal kidney function, thyroid level and lipid profile makes future abnormalities easier to interpret.',
        ],
      },
      {
        heading: 'The overdiagnosis problem',
        body: [
          'Screening scans frequently find incidentalomas: small thyroid nodules, benign liver cysts, adrenal lumps, lung granulomas. Most are harmless and would never have caused symptoms. Finding them triggers anxiety, repeat imaging and sometimes biopsies.',
          'This is not an argument against screening. It is an argument for screening with a plan for what happens when something unexpected appears.',
        ],
      },
      {
        heading: 'Tests that earn their place',
        body: [
          'Blood pressure, HbA1c, lipids, kidney function, CBC, hepatitis B/C, and age-appropriate cancer screening have strong evidence. Whole-body MRI in asymptomatic people does not — it has high false-positive rates and no proven mortality benefit.',
          'Spend your money on the tests that change management, not the ones that produce the longest report.',
        ],
      },
      {
        heading: 'How to handle an incidental finding',
        body: [
          'Ask three questions: How common is this finding? What is the chance it is significant? And what is the recommended follow-up interval? Most small incidentalomas have clear guidelines, and most are followed, not operated.',
          'Get a second read before a biopsy. It is cheaper than a procedure and frequently changes the plan.',
        ],
      },
    ],
    takeaways: [
      'Screening works best when it targets diseases with effective early treatment.',
      'Incidental findings are common and usually benign.',
      'Ask for evidence-based follow-up intervals, not immediate panic.',
    ],
  },
  {
    slug: 'corporate-wellness-that-works',
    title: 'The corporate wellness playbook employees actually use',
    excerpt:
      'Why most workplace health programmes fail, and the four design choices that raise participation above 70%.',
    category: 'Corporate Wellness',
    author: 'Dr. Rohan Iyer',
    authorRole: 'Pulmonology & Sleep Medicine, 13 years',
    date: '2026-07-25',
    readTime: 6,
    heroTone: 'teal',
    sections: [
      {
        heading: 'The participation problem',
        body: [
          'Most corporate health programmes report participation under 30%. The reasons are predictable: inconvenient timing, fear of employer access to results, and a package designed for the brochure rather than the employee.',
          'The programmes that break 70% share four design choices: paid time to attend, home collection as an option, strict data separation from HR, and follow-up on abnormal results.',
        ],
      },
      {
        heading: 'Privacy is the product',
        body: [
          'Employees will not test honestly if they believe results reach their manager. Aggregate reporting must be genuinely aggregate — minimum cohort sizes, no individual identifiers, and a written data-handling policy reviewed by legal.',
          'KOYO gives employers only de-identified cohort dashboards. Individual reports go directly to the employee, full stop.',
        ],
      },
      {
        heading: 'Screen, then act',
        body: [
          'A screening camp without a follow-up pathway is a data collection exercise. The value comes from what happens to the 15% with abnormal results: a nurse call, a discounted consultation, a treatment plan, a recheck.',
          'Track three outcomes: % of abnormal results with a follow-up within 30 days, % of hypertensive employees controlled at 6 months, and % of smokers offered cessation support.',
        ],
      },
      {
        heading: 'Design for the whole year',
        body: [
          'One annual camp is a checkbox. Quarterly touchpoints — a sleep challenge, a step count, a mental-health check-in, a nutrition workshop — keep engagement alive between screenings.',
          'The best predictor of programme success is manager participation. When leadership attends, attendance doubles.',
        ],
      },
    ],
    takeaways: [
      'Pay for the time; do not expect off-hours attendance.',
      'Keep individual data away from employers, in writing.',
      'Measure follow-up, not just participation.',
    ],
  },
  {
    slug: 'thyroid-in-pregnancy',
    title: 'Thyroid in pregnancy: the first 12 weeks matter most',
    excerpt:
      'The fetus depends on your thyroid early on. Why TSH is checked before 8 weeks and how ranges differ.',
    category: "Women's Health",
    author: 'Dr. Sneha Kapoor',
    authorRole: 'Breast Imaging & Gynaecology, 12 years',
    date: '2026-07-16',
    readTime: 5,
    heroTone: 'mauve',
    sections: [
      {
        heading: 'Why the first trimester is different',
        body: [
          'The fetal thyroid does not function until around 12 weeks. Before that, brain development depends entirely on maternal thyroid hormone crossing the placenta.',
          'Both overt and subclinical hypothyroidism in early pregnancy are associated with impaired neurodevelopment and pregnancy loss, which is why screening is recommended at the first antenatal visit.',
        ],
      },
      {
        heading: 'Pregnancy-specific ranges',
        body: [
          'TSH rises slightly in pregnancy, and hCG can suppress it transiently. Using non-pregnant ranges can miss disease or over-treat. Most guidelines use trimester-specific ranges, typically an upper limit near 4.0 mIU/L, lower in iodine-sufficient populations.',
          'Testing thyroid peroxidase antibodies helps identify women at risk of postpartum thyroiditis and progression.',
        ],
      },
      {
        heading: 'Treatment and monitoring',
        body: [
          'Levothyroxine requirements usually rise by 20–30% in pregnancy. Women already on treatment should increase the dose as soon as pregnancy is confirmed and check TSH every four weeks until stable.',
          'Iron and calcium supplements reduce absorption and should be taken at least four hours apart from levothyroxine.',
        ],
      },
      {
        heading: 'After delivery',
        body: [
          'Postpartum thyroiditis affects up to 8% of women, presenting as hyperthyroidism followed by hypothyroidism in the first year. Symptoms are easily attributed to sleep deprivation — test if you are unsure.',
          'Recheck TSH at six to eight weeks postpartum, especially with antibodies or symptoms.',
        ],
      },
    ],
    takeaways: [
      'Check TSH at the first antenatal visit.',
      'Use trimester-specific reference ranges.',
      'Dose requirements typically rise 20–30% in pregnancy.',
    ],
  },
  {
    slug: 'smoking-lungs-spirometry',
    title: 'Smoking and lungs: what spirometry reveals before symptoms',
    excerpt:
      'COPD is often half gone before breathlessness appears. A 20-minute test can find it a decade early.',
    category: 'Respiratory',
    author: 'Dr. Rohan Iyer',
    authorRole: 'Pulmonology & Sleep Medicine, 13 years',
    date: '2026-07-07',
    readTime: 5,
    heroTone: 'ink',
    sections: [
      {
        heading: 'The silent decline',
        body: [
          'Lung function declines with age, but smokers lose it faster. Because we have reserve capacity, breathlessness often appears only after 50–60% of function is gone.',
          'Spirometry detects the decline while it is still modifiable. Stopping smoking at any stage slows the loss; stopping early can return the trajectory close to normal.',
        ],
      },
      {
        heading: 'What the numbers mean',
        body: [
          'FEV1 is the volume you can force out in one second. FVC is the total forced volume. A reduced FEV1/FVC ratio indicates obstruction; a reduced FVC with normal ratio suggests restriction.',
          'Post-bronchodilator values separate reversible asthma from fixed COPD. The difference between the two changes treatment completely.',
        ],
      },
      {
        heading: 'Screening who needs it',
        body: [
          'Anyone over 40 with a smoking history of 10 pack-years, chronic cough, or occupational dust exposure should have a baseline spirometry. It takes 20 minutes and costs less than a restaurant meal.',
          'There is no radiation and no needle. The test is effort-dependent, so a good technician matters more than the machine.',
        ],
      },
      {
        heading: 'What to do with the result',
        body: [
          'Obstruction with symptoms warrants inhaled bronchodilators, pulmonary rehabilitation and smoking cessation support. Vaccination against influenza and pneumococcus reduces exacerbations.',
          'Repeat annually to track decline. A rapid drop should prompt a review of exposure and adherence.',
        ],
      },
    ],
    takeaways: [
      'COPD is often advanced before symptoms appear.',
      'Post-bronchodilator spirometry separates asthma from COPD.',
      'Baseline spirometry is indicated after 10 pack-years.',
    ],
  },
  {
    slug: 'how-to-read-radiology-report',
    title: 'How to read a radiology report without panicking',
    excerpt:
      'A guide to impression, technique, comparison and the words radiologists use when they mean "probably nothing".',
    category: 'Imaging',
    author: 'Dr. Vikram Sethi',
    authorRole: 'Consultant Radiologist, 18 years',
    date: '2026-06-28',
    readTime: 6,
    heroTone: 'teal',
    sections: [
      {
        heading: 'Start at the impression',
        body: [
          'Radiology reports are written for referring doctors, not patients, and the most important part is at the end: the impression. Read that first. The body of the report is the evidence; the impression is the conclusion.',
          'If the impression says "no acute abnormality", that usually means nothing urgent was found on this study — not that nothing is wrong with you.',
        ],
      },
      {
        heading: 'Words that sound worse than they are',
        body: [
          '"Unremarkable" means normal. "Noted" means seen, not necessarily significant. "Cannot be excluded" often means the test cannot answer the question, not that disease is likely. "Recommend correlation with clinical findings" means the radiologist needs your symptoms to interpret the image.',
          'Conversely, "interval increase", "new" and "suspicious" deserve attention. These are the phrases that should prompt a conversation.',
        ],
      },
      {
        heading: 'Why comparison matters',
        body: [
          'A 6 mm nodule is a different problem depending on whether it was 3 mm last year. Without prior imaging, the radiologist can only describe, not characterise change. Always carry your old films or grant access to them.',
          'If you switch centres, request the DICOM files, not just the printed report.',
        ],
      },
      {
        heading: 'Questions worth asking your doctor',
        body: [
          'What question was this scan meant to answer? Did it? What is the next step, and when? Is there a guideline for follow-up? Write these down before the appointment — clinic time is short.',
          'And if a report is ambiguous, ask for a second read. It is a normal request, not an insult.',
        ],
      },
    ],
    takeaways: [
      'Read the impression first; the rest is supporting detail.',
      '“Unremarkable” means normal, not “we missed it”.',
      'Prior imaging makes a report far more useful.',
    ],
  },
  {
    slug: 'prediabetes-three-year-window',
    title: 'Pre-diabetes: the three-year window to reverse it',
    excerpt:
      'HbA1c between 5.7 and 6.4 is not a diagnosis. It is an opportunity with a deadline.',
    category: 'Diabetes',
    author: 'Dr. Ananya Rao',
    authorRole: 'Internal Medicine, 14 years',
    date: '2026-06-19',
    readTime: 5,
    heroTone: 'gold',
    sections: [
      {
        heading: 'What pre-diabetes means',
        body: [
          'Pre-diabetes is a range, not a disease. It means glucose regulation is impaired but not yet at diabetic thresholds. Roughly 5–10% of people progress to diabetes each year; the rest either stay put or revert.',
          'The direction depends heavily on what happens in the next few years. This is why the diagnosis should feel like a warning, not a verdict.',
        ],
      },
      {
        heading: 'The interventions with evidence',
        body: [
          'The Diabetes Prevention Program showed that 7% weight loss plus 150 minutes of weekly activity reduced progression by 58% — better than metformin in most groups. The effect persisted for years after the programme ended.',
          'Sleep and stress matter too. Short sleep worsens insulin sensitivity within days, and untreated sleep apnoea is a common driver of progression.',
        ],
        list: ['7% body-weight loss', '150 minutes of moderate activity weekly', '7–9 hours of sleep', 'Reduce refined carbohydrates and sugary drinks'],
      },
      {
        heading: 'Monitoring without over-testing',
        body: [
          'Check HbA1c every six to twelve months. There is no value in monthly testing — the number moves slowly. Add fasting glucose if you want a second view.',
          'If HbA1c reaches 6.5% on two occasions, the conversation shifts from prevention to treatment. Earlier intervention is easier, not harder.',
        ],
      },
      {
        heading: 'The emotional side',
        body: [
          'Many people experience a pre-diabetes result as a personal failure. It is not. Insulin resistance has strong genetic and environmental drivers, and the response to lifestyle change varies widely.',
          'Focus on one change you can sustain for a year rather than five you can sustain for a month.',
        ],
      },
    ],
    takeaways: [
      'Pre-diabetes progresses in 5–10% of people per year.',
      'Weight loss and activity cut progression by more than half.',
      'Recheck HbA1c every 6–12 months, not monthly.',
    ],
  },
  {
    slug: 'bone-health-after-45',
    title: 'Bone health after 45: beyond calcium',
    excerpt:
      'Calcium alone will not prevent a fracture. Here is the trio that does — and the scan that measures your risk.',
    category: 'Bone Health',
    author: 'Dr. Meera Krishnan',
    authorRole: 'Endocrinology, 11 years',
    date: '2026-06-10',
    readTime: 6,
    heroTone: 'gold',
    sections: [
      {
        heading: 'Bone loss is silent until it breaks',
        body: [
          'Women can lose up to 20% of bone density in the five years after menopause. Men lose more slowly, but the risk catches up after 70. There are no symptoms until a fracture — often a wrist, hip or vertebral compression.',
          'A fragility fracture after a minor fall is a missed opportunity if nobody checks bone density afterwards.',
        ],
      },
      {
        heading: 'The three-legged stool',
        body: [
          'Calcium is the raw material, Vitamin D is the absorption key, and resistance exercise is the signal that tells bone to rebuild. Remove any leg and the stool falls over.',
          'Aim for 1,000–1,200 mg of calcium daily from food where possible, sufficient Vitamin D to keep 25-OH above 30 ng/mL, and two sessions of weight-bearing or resistance training weekly.',
        ],
      },
      {
        heading: 'Who should get a DEXA',
        body: [
          'Women over 65 and men over 70 should be screened. Earlier testing is indicated with a prior fragility fracture, long-term steroid use, early menopause, low body weight, smoking, or a family history of hip fracture.',
          'The report gives a T-score. Below −2.5 is osteoporosis; −1 to −2.5 is osteopenia. The FRAX score adds age and history to estimate 10-year fracture probability.',
        ],
      },
      {
        heading: 'Treatment is effective',
        body: [
          'Bisphosphonates reduce vertebral fractures by roughly half in postmenopausal osteoporosis. Denosumab and anabolic agents are options for severe disease. All are more effective when calcium, Vitamin D and exercise are in place.',
          'Recheck DEXA every one to two years on treatment. Bone changes slowly; testing more often creates noise, not insight.',
        ],
      },
    ],
    takeaways: [
      'Bone loss is asymptomatic until a fracture occurs.',
      'Calcium, Vitamin D and resistance training work together.',
      'DEXA at 65 for women, 70 for men, earlier with risk factors.',
    ],
  },
  {
    slug: 'annual-blood-work-vs-symptom-testing',
    title: 'Why annual blood work beats symptom-driven testing',
    excerpt:
      'Symptoms are a late signal. Annual testing establishes the baseline that makes early detection possible.',
    category: 'Preventive Care',
    author: 'Dr. Ananya Rao',
    authorRole: 'Internal Medicine, 14 years',
    date: '2026-05-30',
    readTime: 5,
    heroTone: 'teal',
    sections: [
      {
        heading: 'The baseline argument',
        body: [
          'A single abnormal result is hard to interpret. Is your creatinine 1.3 high for you, or has it been 1.3 for a decade? Without a baseline, every clinician is guessing.',
          'Annual testing creates a personal reference range. Trends — a ferritin falling over two years, an eGFR drifting down — are often more informative than any single value.',
        ],
      },
      {
        heading: 'Silent conditions are the point',
        body: [
          'Hypertension, diabetes, chronic kidney disease, hepatitis B and high cholesterol are all asymptomatic for years. They are also among the most treatable conditions in medicine when found early.',
          'Waiting for symptoms means waiting for complications: stroke, retinopathy, cirrhosis, dialysis. Screening exists precisely because symptoms arrive too late.',
        ],
      },
      {
        heading: 'Avoiding unnecessary testing',
        body: [
          'Annual does not mean everything annually. Some tests (Vitamin D, ferritin, thyroid) can be spaced out if normal and stable. Others (blood pressure, weight, lipids) benefit from yearly tracking.',
          'A good physician prunes the panel over time. More tests mean more false positives, and false positives have real costs.',
        ],
      },
      {
        heading: 'Making it sustainable',
        body: [
          'Use the same lab where possible, keep reports in one place, and bring them to every consultation. A well-organised health record is worth more than an extra scan.',
          'The goal is not perfect numbers. It is catching the things that matter while they are still fixable.',
        ],
      },
    ],
    takeaways: [
      'Baselines turn single values into meaningful trends.',
      'Most chronic disease is silent for years.',
      'Prune your panel over time; more is not always better.',
    ],
  },
  {
    slug: 'reading-your-lipid-profile-beyond-ldl',
    title: 'Reading a lipid profile: beyond LDL cholesterol',
    excerpt:
      'LDL is one number in a panel of six. ApoB, triglycerides and the ratio between them often tell a clearer story.',
    category: 'Heart health',
    author: 'Dr. Arjun Malhotra',
    authorRole: 'Cardiology, 16 years',
    date: '2026-05-12',
    readTime: 7,
    heroTone: 'clay',
    sections: [
      {
        heading: 'What the standard panel measures',
        body: [
          'A lipid profile reports total cholesterol, LDL, HDL and triglycerides. Most of the clinical conversation stops at LDL because it is the best-studied target for statin therapy. That does not make it the best single predictor for an individual.',
          'LDL is a concentration of cholesterol carried in particles, not a count of the particles themselves. Two people with an LDL of 110 can have very different particle burdens.',
        ],
      },
      {
        heading: 'ApoB is the particle count',
        body: [
          'Every atherogenic particle — LDL, VLDL, IDL, Lp(a) — carries exactly one ApoB molecule. Measuring ApoB therefore counts the particles that actually deposit in the arterial wall.',
          'In people with high triglycerides, diabetes or metabolic syndrome, ApoB can be discordantly high while LDL looks acceptable. That is the pattern most often missed on a basic panel.',
        ],
        list: [
          'ApoB under 90 mg/dL is a reasonable target for average risk',
          'Under 70 mg/dL for established cardiovascular disease or diabetes',
          'Under 55 mg/dL after a recent event, per current guidance',
        ],
      },
      {
        heading: 'Triglycerides and the ratio',
        body: [
          'Triglycerides above 150 mg/dL usually signal insulin resistance rather than a primary lipid disorder. The triglyceride-to-HDL ratio above 3.5 is a practical proxy for that.',
          'This matters because the treatment is different. If the driver is insulin resistance, diet and activity change more than a statin will.',
        ],
      },
      {
        heading: 'When to repeat the test',
        body: [
          'After a lifestyle change, wait twelve weeks. Lipid values move slowly, and testing at four weeks mostly measures noise. After starting a statin, repeat at eight to twelve weeks to confirm response and check liver enzymes.',
          'Fasting is not always required for LDL and HDL, but it is for triglycerides. If your lab reports a non-fasting triglyceride above 200, a fasting repeat is worth doing.',
        ],
      },
    ],
    takeaways: [
      'LDL alone can miss high-risk particle burden.',
      'ApoB counts atherogenic particles and is worth adding for metabolic risk.',
      'High triglycerides usually mean insulin resistance, not just diet fat.',
    ],
  },
  {
    slug: 'thyroid-tests-when-tsh-is-not-enough',
    title: 'Thyroid tests: when TSH is not enough',
    excerpt:
      'TSH is a excellent screening test and a poor standalone explanation. Here is when to add free T4, T3 and antibodies.',
    category: 'Thyroid',
    author: 'Dr. Meera Krishnan',
    authorRole: 'Endocrinology, 11 years',
    date: '2026-04-24',
    readTime: 6,
    heroTone: 'mauve',
    sections: [
      {
        heading: 'Why TSH comes first',
        body: [
          'TSH is the pituitary\'s instruction to the thyroid. Because the pituitary responds logarithmically, small changes in thyroid hormone produce large changes in TSH. That makes TSH a sensitive early marker.',
          'A normal TSH with symptoms is not automatically reassuring. It depends on which symptoms, how long they have been present, and whether the thyroid is the plausible explanation.',
        ],
      },
      {
        heading: 'Adding free T4 and T3',
        body: [
          'Free T4 confirms whether a raised TSH reflects genuine thyroid failure. Free T3 helps in two situations: suspected hyperthyroidism with a suppressed TSH, and patients on replacement therapy who remain symptomatic despite a normal TSH.',
          'Total T3 and T4 are affected by pregnancy, oral contraceptives and liver disease. Free hormone measurements are preferred in those contexts.',
        ],
      },
      {
        heading: 'Antibodies explain the cause',
        body: [
          'Anti-TPO antibodies are present in most Hashimoto\'s thyroiditis and in a proportion of Graves\' disease. They do not need to be repeated once positive — the titre does not track disease activity.',
          'TSH receptor antibodies matter in pregnancy and before thyroid surgery, because they can cross the placenta and affect the fetus.',
        ],
      },
      {
        heading: 'A practical testing sequence',
        body: [
          'Start with TSH. If abnormal, add free T4. Add anti-TPO if the cause is unclear or the patient has a family history of autoimmune disease. Add free T3 for suspected hyperthyroidism or persistent symptoms on treatment.',
          'Repeat testing no sooner than six to eight weeks after a dose change. Thyroid hormone equilibration takes that long, and earlier testing leads to unnecessary dose adjustments.',
        ],
      },
    ],
    takeaways: [
      'TSH is a screening test, not a diagnosis.',
      'Free T4 confirms severity; free T3 helps in specific scenarios.',
      'Wait six to eight weeks before repeating after a dose change.',
    ],
  },
  {
    slug: 'what-an-mri-does-not-show',
    title: 'What an MRI does not show',
    excerpt:
      'A normal scan is not a clean bill of health. Understanding the limits of imaging prevents false reassurance.',
    category: 'Imaging',
    author: 'Dr. Vikram Sethi',
    authorRole: 'Radiology, 18 years',
    date: '2026-04-08',
    readTime: 6,
    heroTone: 'ink',
    sections: [
      {
        heading: 'Resolution has a floor',
        body: [
          'A 3T MRI resolves structures of roughly one millimetre. That sounds impressive until you consider that early cellular change happens well below that scale. A tumour must reach a certain size and contrast before it becomes visible.',
          'This is why a normal scan in the presence of persistent symptoms is a reason to keep investigating, not a reason to stop.',
        ],
      },
      {
        heading: 'Function is invisible',
        body: [
          'MRI shows structure. It does not show how well a tissue works. A pituitary can look normal while producing too little hormone; a brain can look normal in epilepsy, migraine and many psychiatric conditions.',
          'Functional imaging — PET, functional MRI, spectroscopy — answers different questions and is used selectively, not as a better version of a standard scan.',
        ],
      },
      {
        heading: 'Incidental findings are common',
        body: [
          'Around one in five brain MRIs in healthy adults shows an incidental finding: a small white-matter lesion, a benign cyst, a developmental variant. Most are harmless and require no action.',
          'The risk is the cascade that follows: more scans, anxiety, sometimes a biopsy. A radiologist who says “this does not need follow-up” is doing valuable work, not being lazy.',
        ],
      },
      {
        heading: 'Choose the right test',
        body: [
          'MRI is excellent for soft tissue, joints, the spinal cord and the brain. CT is faster and better for bone and acute bleeding. Ultrasound is the right first test for gallbladder, thyroid and most abdominal screening questions.',
          'The most useful question to ask before any scan is: what will I do differently depending on the result? If the answer is nothing, the scan may not be needed yet.',
        ],
      },
    ],
    takeaways: [
      'Normal imaging does not exclude early or functional disease.',
      'Incidental findings are common and usually benign.',
      'Ask what management will change before ordering a scan.',
    ],
  },
  {
    slug: 'prediabetes-what-the-number-means',
    title: 'Prediabetes: what the number actually means',
    excerpt:
      'An HbA1c of 6.1% is not a diagnosis of diabetes. It is a window — often a long one — and what happens next is not fixed.',
    category: 'Diabetes',
    author: 'Dr. Meera Krishnan',
    authorRole: 'Endocrinology, 11 years',
    date: '2026-03-26',
    readTime: 7,
    heroTone: 'gold',
    sections: [
      {
        heading: 'Where the lines sit',
        body: [
          'HbA1c between 5.7% and 6.4% is classified as prediabetes. Fasting glucose between 100 and 125 mg/dL carries the same label. Both are statistical risk markers, not diseases in themselves.',
          'Progression to diabetes is not inevitable. In the Diabetes Prevention Program, intensive lifestyle change reduced progression by 58% over three years — better than metformin in the same trial.',
        ],
      },
      {
        heading: 'Why South Asians progress faster',
        body: [
          'South Asians develop insulin resistance at lower body mass indices and store more visceral fat for the same waist circumference. Prediabetes therefore converts to diabetes faster and at younger ages.',
          'This is why a 6.2% at 34 deserves more attention than the same value at 64 in a different population. Context changes the urgency, not the label.',
        ],
      },
      {
        heading: 'What actually works',
        body: [
          'Modest weight loss of 5–7% is the single most effective intervention. That is 4–6 kg for most people — achievable without extreme diets.',
          'Resistance training twice a week improves glucose uptake independently of weight loss. Reducing refined carbohydrate and adding fibre both help, but the effect is smaller than the combination of activity and modest weight change.',
        ],
        list: [
          'Aim for 150 minutes of moderate activity weekly',
          'Two resistance sessions weekly',
          'Repeat HbA1c at 6–12 months, not sooner',
        ],
      },
      {
        heading: 'When medication is reasonable',
        body: [
          'Metformin is reasonable when HbA1c is above 6.0%, weight is rising, or there is a history of gestational diabetes. It is not a substitute for lifestyle change and should not be started reflexively at 5.8%.',
          'The most useful conversation is not about the label. It is about which two or three changes are realistic in the next three months.',
        ],
      },
    ],
    takeaways: [
      'Prediabetes is a risk marker, not a diagnosis.',
      'Lifestyle change outperforms medication in prevention trials.',
      'South Asians progress faster at lower BMI — act earlier.',
    ],
  },
  {
    slug: 'vitamin-b12-who-should-test',
    title: 'Vitamin B12: who should test, and who is wasting money',
    excerpt:
      'B12 deficiency is common in India, but blanket annual testing mostly finds mildly low values of uncertain significance.',
    category: 'Nutrition',
    author: 'Dr. Farah Qureshi',
    authorRole: 'Pathology, 9 years',
    date: '2026-03-12',
    readTime: 5,
    heroTone: 'teal',
    sections: [
      {
        heading: 'Why deficiency is common here',
        body: [
          'Vegetarian and vegan diets supply little or no B12, and a large share of Indian adults eat little meat. Metformin reduces absorption, as do long-term proton-pump inhibitors and bariatric surgery.',
          'The result is a population where low B12 is genuinely common — and where blanket supplementation without testing has become equally common.',
        ],
      },
      {
        heading: 'Who benefits from testing',
        body: [
          'Test if you have symptoms (fatigue, tingling in hands or feet, memory difficulty, mouth ulcers), if you follow a vegan diet, if you take metformin or a PPI long term, or if you have a macrocytic anaemia on a blood count.',
          'For everyone else, a test every two to three years as part of an annual panel is reasonable. Testing monthly, as some wellness apps encourage, produces noise and anxiety.',
        ],
        list: [
          'Vegans and strict vegetarians: test every 1–2 years',
          'Metformin users: test annually',
          'Pregnancy: test early, supplement if low',
        ],
      },
      {
        heading: 'Reading the number',
        body: [
          'Serum B12 below 200 pg/mL suggests deficiency; 200–300 is borderline and needs a second marker. Methylmalonic acid and homocysteine rise before serum B12 falls, and are more sensitive in the borderline range.',
          'A B12 of 180 with no symptoms and a normal blood count is not an emergency. It is a reason to improve intake and recheck, not to start injections.',
        ],
      },
      {
        heading: 'Treating it sensibly',
        body: [
          'Oral B12 at 1,000–1,500 mcg daily corrects most dietary deficiency, even in people with reduced absorption, because a small fraction is absorbed passively. Injections are reserved for severe deficiency, neurological symptoms or after bariatric surgery.',
          'Recheck after eight to twelve weeks. If levels do not rise, look for a cause — pernicious anaemia, coeliac disease, bacterial overgrowth — rather than escalating the dose indefinitely.',
        ],
      },
    ],
    takeaways: [
      'B12 deficiency is common in vegetarian diets and with metformin.',
      'Borderline values need MMA or homocysteine, not repeat testing.',
      'Oral supplementation works for most people; injections are for severe cases.',
    ],
  },  {
    slug: 'fasting-before-blood-tests-explained',
    title: 'Fasting before a blood test: what actually matters',
    excerpt:
      'Eight to twelve hours, water is fine, and black coffee probably is too. The rest is mostly myth.',
    category: 'Preventive Care',
    author: 'Dr. Farah Qureshi',
    authorRole: 'Pathology, 9 years',
    date: '2026-02-27',
    readTime: 4,
    heroTone: 'ink',
    sections: [
      {
        heading: 'Which tests need fasting',
        body: [
          'Triglycerides, fasting glucose and many lipid panels require 8–12 hours without calories. HbA1c, thyroid function, Vitamin D, B12, ferritin, CBC and most hormone tests do not.',
          'If you are booking a combined panel, the fasting requirement of the strictest test applies to the whole draw. Our booking flow flags this before payment.',
        ],
      },
      {
        heading: 'What breaks a fast',
        body: [
          'Water is fine and encouraged — dehydration makes veins harder to find. Black coffee and plain tea without sugar or milk do not meaningfully affect most values, though they can raise cortisol transiently.',
          'Anything with calories counts: milk, juice, a biscuit, a spoon of sugar. Even chewing gum with sweetener is usually fine, but gum with sugar is not.',
        ],
      },
      {
        heading: 'The night before',
        body: [
          'Have a normal dinner rather than a very late or unusually large one. Alcohol within 24 hours raises triglycerides and liver enzymes. Strenuous exercise the evening before can raise CK, AST and ALT.',
          'Take regular medication unless your physician says otherwise. Stopping thyroid or blood pressure medication for a blood test is usually the wrong call.',
        ],
      },
      {
        heading: 'If you accidentally eat',
        body: [
          'Tell the phlebotomist. A non-fasting sample is still useful for most parameters, and the lab will note the fasting status. Triglycerides and fasting glucose may need a repeat, but you do not need to cancel the whole appointment.',
        ],
      },
    ],
    takeaways: [
      'Only some tests require fasting — check before you skip breakfast.',
      'Water and unsweetened black coffee are fine.',
      'Tell the phlebotomist if you ate; do not cancel the visit.',
    ],
  },
];

export function getBlog(slug: string) {
  return blogs.find((b) => b.slug === slug);
}

export const blogCategories = Array.from(new Set(blogs.map((b) => b.category)));

export const relatedBlogs = (slug: string, count = 3) => {
  const current = getBlog(slug);
  if (!current) return blogs.slice(0, count);
  return blogs
    .filter((b) => b.slug !== slug)
    .sort((a, b) => Number(b.category === current.category) - Number(a.category === current.category))
    .slice(0, count);
};
