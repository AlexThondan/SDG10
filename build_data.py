import json
import os

sdgs = {
    "1": {
        "num": "1",
        "title": "End poverty in all its forms everywhere",
        "name": "No Poverty",
        "description": [
            "Sustainable Development Goal 1 (SDG 1) – No Poverty aims to end poverty in all its forms everywhere. It focuses on eliminating extreme poverty, reducing economic inequalities, and ensuring that individuals and communities have equal access to resources, opportunities, and essential services required for a dignified life.",
            "SDG 1 promotes inclusive economic growth, social protection systems, financial inclusion, access to education, employment opportunities, and support for vulnerable populations. It encourages governments, institutions, and organisations to implement policies and programmes that empower economically disadvantaged communities and improve their quality of life.",
            "For higher education institutions, SDG 1 focuses on ensuring equal access to education irrespective of financial background, providing scholarships and financial assistance to economically weaker students, supporting student success and completion, conducting poverty-related research, and engaging in community initiatives that contribute to poverty reduction and sustainable development.",
            "Through initiatives such as financial aid, student welfare programmes, research on poverty alleviation, skill development, and community outreach, universities contribute significantly towards creating equitable opportunities and supporting the global mission of achieving No Poverty by 2030."
        ],
        "color": "#E5243B",
        "colorLight": "rgba(229, 36, 59, 0.08)",
        "colorBorder": "rgba(229, 36, 59, 0.25)",
        "image": "images/sdg-1.webp",
        "targets": [
            {
                "id": "1.1",
                "desc": "Research on poverty",
                "annexure": "Annexure 1",
                "metricsTable": [
                    {"metric": "Papers co-authored with low or lower-middle income countries", "value": "NIL"},
                    {"metric": "No Poverty: FWCI", "value": "13"},
                    {"metric": "No Poverty Publications", "value": "23"}
                ],
                "indicators": [
                    "1.1.1 Papers co-authored with low or lower-middle income countries",
                    "1.1.2 No poverty: FWCI",
                    "1.1.3 No poverty: publications"
                ]
            },
            {
                "id": "1.2",
                "desc": "Proportion of students receiving financial aid to attend university because of poverty",
                "indicators": [
                    "1.2.1 Low-income students receiving financial aid"
                ]
            },
            {
                "id": "1.3",
                "desc": "University anti-poverty programmes",
                "annexure": "Annexure 2",
                "file": "https://docs.google.com/document/d/1ufEA3Mm39eg5EpNIHg0PhSQcSR6fU5wB",
                "url": "https://kristujayanti.edu.in/student-services/scholarship/",
                "evidenceTable": [
                    {
                        "sl": "1",
                        "details": "Does your university as a body have targets to admit students who fall into the bottom 20% of household income group (or a more tightly defined target) in the country?",
                        "exists": "Yes",
                        "specificity": "38%",
                        "public": "Yes",
                        "notProvided": ""
                    },
                    {
                        "sl": "2",
                        "details": "Does your university as a body have graduation/completion targets for students who fall into the bottom 20% of household income group (or a more tightly defined target) in the country? (domestic)",
                        "exists": "Yes",
                        "specificity": "100%",
                        "public": "Yes",
                        "notProvided": ""
                    },
                    {
                        "sl": "3",
                        "details": "Does your university as a body provide support (e.g. food, housing, transportation, legal services) for students from low-income families to enable them to complete university?",
                        "exists": "If Yes (Subsidised/ Free)",
                        "specificity": "40%",
                        "public": "Yes",
                        "notProvided": ""
                    },
                    {
                        "sl": "4",
                        "details": "Does your university as a body have programmes or initiatives to assist students who fall into the bottom 20% of household income group (or a more tightly defined target) in the country to successfully complete their studies?",
                        "exists": "Yes",
                        "specificity": "Scholarship",
                        "public": "Yes",
                        "notProvided": ""
                    },
                    {
                        "sl": "5",
                        "details": "Does your university as a body have schemes to support poor students from low or lower-middle income countries (e.g. offering free education, grants)?",
                        "exists": "Yes",
                        "specificity": "Scholarship",
                        "public": "Yes",
                        "notProvided": ""
                    }
                ],
                "indicators": [
                    {
                        "text": "1.3.1 Bottom financial quintile admission target",
                        "subtitle": "Admission Targets for Students from Economically Weaker Sections",
                        "description": [
                            "The University is strongly committed to promoting inclusive and equitable access to higher education by establishing dedicated admission targets for students belonging to economically weaker sections, including those from the bottom financial quintile (lowest 20% household income group). As part of its commitment towards reducing educational inequalities, the University ensures that students from financially disadvantaged backgrounds receive opportunities to pursue quality higher education.",
                            "Approximately 38% of student admissions are from economically disadvantaged backgrounds, reflecting the institution’s sustained efforts towards widening access and supporting students from low-income families. The University follows a transparent and inclusive admission process that considers socio-economic factors and provides appropriate support mechanisms to encourage participation from underprivileged communities.",
                            "To facilitate access and reduce financial barriers, the University implements a range of initiatives including need-based scholarships, fee concessions, financial assistance schemes, and student welfare support programmes. These initiatives ensure that economic limitations do not prevent deserving students from enrolling in and benefiting from higher education opportunities.",
                            "The University also undertakes awareness initiatives and outreach activities to encourage applications from students belonging to financially vulnerable groups. Eligible students are identified through established income criteria and supporting documentation, ensuring fairness, transparency, and effective delivery of institutional support.",
                            "The progress and effectiveness of these initiatives are periodically reviewed to strengthen admission practices and enhance opportunities for students from economically weaker sections. Through these targeted admission initiatives, the University contributes significantly towards Sustainable Development Goal 1 (No Poverty) by promoting educational inclusion, social equity, and pathways for socio-economic advancement."
                        ]
                    },
                    {
                        "text": "1.3.2 Bottom financial quintile student success",
                        "subtitle": "Graduation and Completion Targets for Students from Economically Weaker Sections",
                        "description": [
                            "The University is committed to ensuring equitable educational outcomes by achieving a 100% graduation and programme completion target for students belonging to the bottom financial quintile (lowest 20% household income group). Recognizing that financial constraints should not hinder academic success; the University has established comprehensive academic and financial support mechanisms to enable students from economically disadvantaged backgrounds to successfully complete their studies within the prescribed duration.",
                            "To achieve this target, the University provides need-based scholarships, fee concessions, financial assistance, tuition fee support, mentoring, academic advising, counselling services, and career guidance. These initiatives are designed to minimize financial and academic barriers while fostering student engagement, retention, and academic progression.",
                            "The academic progress of economically disadvantaged students is continuously monitored through faculty mentors, programme coordinators, and student support services. Students identified as being at risk of academic discontinuation receive timely interventions, including personalized mentoring, financial support, counselling, and academic assistance, ensuring that they remain on track to complete their programmes.",
                            "The University periodically reviews student retention, progression, and graduation outcomes to assess the effectiveness of its support systems and to strengthen institutional policies that promote inclusive education. Through its commitment to a 100% graduation and completion target, the University ensures that students from economically weaker sections are provided with equal opportunities to successfully complete their higher education, thereby contributing to social mobility, economic empowerment, and the achievement of Sustainable Development Goal 1 (No Poverty)."
                        ]
                    },
                    {
                        "text": "1.3.3 Low-income student support",
                        "subtitle": "Support for Students from Low-Income Families to Enable Programme Completion",
                        "description": [
                            "The University is committed to ensuring that students from low-income families are able to successfully pursue and complete their higher education without financial hardship becoming a barrier. Approximately 40% of students benefit from various institutional support measures designed to promote access, retention, academic success, and timely programme completion.",
                            "To support economically disadvantaged students, the University provides a comprehensive range of assistance, including financial aid, scholarships, fee concessions, subsidized hostel accommodation, food support, transportation assistance, emergency financial assistance, counselling services, mentoring, healthcare support, and legal assistance, wherever applicable. These initiatives are aimed at addressing both academic and non-academic challenges that may affect student progression and completion.",
                            "The University also offers academic mentoring, remedial support, career guidance, and student welfare services to ensure that students receive holistic support throughout their educational journey. Faculty mentors and student support offices regularly monitor the academic progress and well-being of students from low-income families and provide timely interventions whenever additional assistance is required.",
                            "The identification of eligible beneficiaries is carried out through transparent and well-defined criteria based on socio-economic status and supporting documentation, ensuring fairness and equitable access to institutional support. The effectiveness of these support initiatives is periodically reviewed through student feedback, welfare committees, and institutional monitoring mechanisms to strengthen student success and retention.",
                            "Through these sustained efforts, the University fosters an inclusive learning environment where students from economically weaker backgrounds are empowered to overcome financial and social barriers, successfully complete their education, and improve their long-term socio-economic prospects. These initiatives reflect the University's strong commitment to Sustainable Development Goal 1 (No Poverty) by promoting equitable access to education and supporting students throughout their academic journey."
                        ]
                    },
                    {
                        "text": "1.3.4 Bottom financial quintile student support",
                        "subtitle": "Programmes and Initiatives to Support Students from Economically Weaker Sections for Successful Completion of Studies",
                        "url": "https://kristujayanti.edu.in/student-services/scholarship/",
                        "description": [
                            "The University has established comprehensive support initiatives to assist students belonging to the bottom financial quintile (lowest 20% household income group) in successfully completing their academic programmes. Recognizing that financial constraints can impact students’ ability to continue their education, the University provides need-based scholarships and financial assistance to economically disadvantaged students to ensure equitable access to higher education and promote student success.",
                            "Through its scholarship programmes, the University offers financial support to eligible students based on socio-economic background, family income criteria, and demonstrated financial need. These scholarships help reduce the financial burden associated with tuition fees and other educational expenses, enabling deserving students to continue their studies without interruption.",
                            "In addition to scholarships, the University supports beneficiaries through student welfare initiatives, academic mentoring, counselling services, and guidance mechanisms to enhance retention, academic progression, and successful programme completion. Faculty mentors and designated support teams regularly monitor students’ academic performance and provide timely assistance to those requiring additional support.",
                            "The scholarship initiatives are implemented through a transparent and systematic process, ensuring that financial assistance reaches students who require it the most. The University periodically reviews the effectiveness of these initiatives to strengthen its commitment towards inclusive education and equal learning opportunities.",
                            "Through these sustained efforts, the University contributes to reducing educational inequalities and empowering students from economically weaker sections to complete their higher education successfully. These initiatives directly support Sustainable Development Goal 1 (No Poverty) by promoting access to quality education, improving student retention, and enabling socio-economic advancement."
                        ]
                    },
                    {
                        "text": "1.3.5 Low or lower-middle income countries student support",
                        "subtitle": "Programmes and Initiatives to Support Students from Economically Weaker Sections for Successful Completion of Studies",
                        "url": "https://kristujayanti.edu.in/student-services/scholarship/",
                        "description": [
                            "The University has established comprehensive support initiatives to assist students belonging to the bottom financial quintile (lowest 20% household income group) in successfully completing their academic programmes. Recognizing that financial constraints can impact students’ ability to continue their education, the University provides need-based scholarships and financial assistance to economically disadvantaged students to ensure equitable access to higher education and promote student success.",
                            "Through its scholarship programmes, the University offers financial support to eligible students based on socio-economic background, family income criteria, and demonstrated financial need. These scholarships help reduce the financial burden associated with tuition fees and other educational expenses, enabling deserving students to continue their studies without interruption.",
                            "In addition to scholarships, the University supports beneficiaries through student welfare initiatives, academic mentoring, counselling services, and guidance mechanisms to enhance retention, academic progression, and successful programme completion. Faculty mentors and designated support teams regularly monitor students’ academic performance and provide timely assistance to those requiring additional support.",
                            "The scholarship initiatives are implemented through a transparent and systematic process, ensuring that financial assistance reaches students who require it the most. The University periodically reviews the effectiveness of these initiatives to strengthen its commitment towards inclusive education and equal learning opportunities.",
                            "Through these sustained efforts, the University contributes to reducing educational inequalities and empowering students from economically weaker sections to complete their higher education successfully. These initiatives directly support Sustainable Development Goal 1 (No Poverty) by promoting access to quality education, improving student retention, and enabling socio-economic advancement."
                        ]
                    }
                ]
            },
            {
                "id": "1.4",
                "desc": "Community anti-poverty programmes",
                "indicators": [
                    "1.4.1 Local start-up assistance",
                    "1.4.2 Local start-up financial assistance",
                    "1.4.3 Programmes for services access",
                    "1.4.4 Policy addressing poverty"
                ]
            }
        ]
    },
    "4": {
        "num": "4",
        "title": "Ensure inclusive and equitable quality education and promote lifelong learning opportunities for all",
        "name": "Quality Education",
        "color": "#C5192D",
        "colorLight": "rgba(197, 25, 45, 0.08)",
        "colorBorder": "rgba(197, 25, 45, 0.25)",
        "image": "images/sdg-4.webp",
        "targets": [
            {
                "id": "4.3",
                "desc": "By 2030, ensure equal access for all women and men to affordable and quality technical, vocational and tertiary education, including university",
                "indicators": [
                    {
                        "text": "4.3.1 Does your university as a body provide free access to educational resources for those not studying at the university, e.g., computers, library, online courses, access to lectures, etc?",
                        "subItems": [
                            {
                                "text": "A. Report on Free Access to Educational Resources Through the University Library Website",
                                "pdf": "https://d2di5o2d0ilx7p.cloudfront.net/sdg-ranking/4.3/4.3.1.pdf#page=1"
                            },
                            {
                                "text": "B. Report on Open Access Educational Content Made Available to the General Public",
                                "pdf": "https://d2di5o2d0ilx7p.cloudfront.net/sdg-ranking/4.3/4.3.1.pdf#page=6"
                            },
                            {
                                "text": "C. Certificate Courses",
                                "pdf": "https://d2di5o2d0ilx7p.cloudfront.net/sdg-ranking/4.3/4.3.1.pdf#page=8"
                            }
                        ]
                    },
                    {
                        "text": "4.3.2 Does your university as a body host event at university that are open to the general public: public lectures, community educational events?",
                        "pdf": "https://d2di5o2d0ilx7p.cloudfront.net/sdg-ranking/4.3/4.3.2.pdf"
                    },
                    {
                        "text": "4.3.3 Vocational training events (lifelong learning)",
                        "pdf": "https://d2di5o2d0ilx7p.cloudfront.net/sdg-ranking/4.3/4.3.3.pdf"
                    },
                    {
                        "text": "4.3.4 Does your university as a body undertake educational outreach activities (e.g.tailored lectures or demonstrations) beyond campus, e.g. in local schools, in the community, including voluntary student-run schemes?",
                        "pdf": "https://d2di5o2d0ilx7p.cloudfront.net/sdg-ranking/4.3/4.3.4.pdf"
                    },
                    {
                        "text": "4.3.5 Does your university as a body have a policy that ensures that access to these activities is accessible to all, regardless of ethnicity, religion, disability, immigration status or gender?",
                        "pdf": "https://d2di5o2d0ilx7p.cloudfront.net/sdg-ranking/4.3/4.3.5.pdf"
                    }
                ]
            }
        ]
    },
    "10": {
        "num": "10",
        "title": "Reduce inequality within and among countries",
        "name": "Reduced Inequalities",
        "description": [
            "Sustainable Development Goal 10 (SDG 10), established by the United Nations under the 2030 Agenda for Sustainable Development, aims to reduce inequalities within and among countries. It focuses on promoting social, economic and political inclusion, ensuring equal opportunities and eliminating discrimination irrespective of gender, disability, age, socioeconomic status or social background.",
            "Higher education institutions play a significant role in achieving SDG 10 by providing equitable access to education, promoting diversity, supporting underrepresented communities and creating inclusive academic and workplace environments.",
            "Kristu Jayanti (Deemed to be University), Bengaluru, recognises the importance of equality, diversity and social inclusion as essential components of sustainable development. Through its academic initiatives, institutional policies, student support services, research activities and community engagement programmes, the University strives to promote equal opportunities and contribute towards building an inclusive society.",
            "The University is committed to fostering an inclusive educational environment through: providing equitable educational opportunities to students from diverse socioeconomic backgrounds; promoting gender equality, diversity and social inclusion; supporting disadvantaged and first-generation learners through targeted mentoring; improving accessibility and support for persons with disabilities; encouraging inclusive recruitment and equal employment opportunities; advancing research on social justice and inequality; conducting community outreach for underrepresented groups; and implementing statutory grievance redressal mechanisms to prevent discrimination and harassment."
        ],
        "color": "#DD1367",
        "colorLight": "rgba(221, 19, 103, 0.08)",
        "colorBorder": "rgba(221, 19, 103, 0.25)",
        "image": "images/sdg-10.webp",
        "targets": []
    },
    "17": {
        "num": "17",
        "title": "Strengthen the means of implementation and revitalize the Global Partnership for Sustainable Development",
        "name": "Partnerships for the Goals",
        "description": "Goal 17 is about revitalizing the global partnership for sustainable development. The Sustainable Development Goals (SDGs) are a universal blueprint and a call to action for all countries—both developed and developing—to ensure no one is left behind. Achieving them requires active partnerships between governments, the private sector, and civil society. These Goals can only be realized with a strong commitment to global cooperation, ensuring that everyone progresses together on our journey to development.",
        "color": "#19486A",
        "colorLight": "rgba(25, 72, 106, 0.08)",
        "colorBorder": "rgba(25, 72, 106, 0.25)",
        "image": "images/sdg-17.webp",
        "targets": []
    }
}

if os.path.exists("sdg1_target1_4.json"):
    with open("sdg1_target1_4.json", "r", encoding="utf-8") as f:
        sdgs["1"]["targets"][3]["indicators"] = json.load(f)

if os.path.exists("sdg4_full_extracted.json"):
    with open("sdg4_full_extracted.json", "r", encoding="utf-8") as f:
        sdgs["4"]["targets"] = json.load(f)

if os.path.exists("sdg10_full_extracted.json"):
    with open("sdg10_full_extracted.json", "r", encoding="utf-8") as f:
        sdgs["10"]["targets"] = json.load(f)

if os.path.exists("sdg17_full_extracted.json"):
    with open("sdg17_full_extracted.json", "r", encoding="utf-8") as f:
        sdgs["17"]["targets"] = json.load(f)

with open("sdg_data.json", "w", encoding="utf-8") as f:
    json.dump(sdgs, f, indent=2, ensure_ascii=False)

print("Saved sdg_data.json successfully!")

