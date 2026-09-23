import type { LineageArticle } from "../components/LineageBlogArticle";

type Seed = Omit<LineageArticle, "sections" | "faqs"> & {
  traditionName: string; figureName: string; focus: string; productPath: string;
  uniqueSections: LineageArticle["sections"];
  specialFaqs: Array<[string, string]>;
};

function build(s: Seed): LineageArticle {
  const sections: LineageArticle["sections"] = [
    ...s.uniqueSections,
    { title: `How a ${s.traditionName} leaf search is described`, paragraphs: [
      `A palm-leaf search begins with an observable procedure, not with the fame of the attributed figure. Centres commonly classify a thumb impression, select a candidate bundle and read identifying statements. The seeker answers briefly until a candidate is accepted or the available search ends. The name “${s.traditionName}” may identify a manuscript family, an inherited catalogue label, a reader lineage or a present-day service category; the centre should say which meaning it intends.`,
      `Keep matching separate from the later interpretation. Note what personal information was collected before the first candidate statement, whether rejected leaves were actually set aside, which source language and script were claimed, and whether the physical leaf was shown. A meaningful test must permit “no match.” Reframing every contradiction as symbolic, future or karmic prevents a candidate from ever being rejected.`,
    ], checklist: { title: "Before sharing a thumb impression", lines: [
      `Ask what “${s.traditionName}” identifies in this collection.`, "Confirm the search-only price and non-match policy.", "Ask who can access the thumbprint and when it is deleted.", "Confirm the reading and translation languages.", "Request permission to record and see the source leaf.", "Keep later chapters and remedies as separate choices."
    ] } },
    { title: "Separate leaf wording, translation and interpretation", paragraphs: [
      `Three voices may be heard in one session: words read from the manuscript, the translator’s rendering and the practitioner’s explanation. Ask the reader to mark the boundaries. A technical term may have several meanings; a name sound may be approximate; a cultural reference may need context. Recording those distinctions is more useful than turning an uncertain phrase into a definite prediction.`,
      `After the session, sort statements into past facts, present descriptions, future claims and spiritual counsel. Past details can sometimes be checked against records, although prior disclosure remains a possible source. Future claims need dates and clear criteria before they can be reviewed. Spiritual guidance can be meaningful without becoming a command. Medical, legal and financial decisions still require qualified evidence.`,
    ] },
    { title: `Who may find ${s.traditionName} meaningful`, paragraphs: [
      `${s.traditionName} may appeal to a seeker drawn to ${s.focus}. That affinity is a reason to explore the tradition, not proof that a leaf must exist. A person may also receive a candidate whose themes are broader or different from the modern description. The content of a genuinely matched leaf should lead; the label should not be used to force every life story into a predetermined profile.`,
      `A careful provider makes room for religious diversity, uncertainty and refusal. You may value the sacred figure while declining a remedy, another chapter or a claim that does not fit. No tradition name can guarantee accuracy, healing, marriage, wealth, legal success or spiritual advancement. The most respectful approach combines devotion with consent, transparent cost and the freedom to pause.`,
    ] },
    { title: "A practical verification plan", paragraphs: [
      `Before booking, write the questions you want answered and the information you will not disclose during matching. During the session, keep a simple log of each statement and response. Ask for the original wording when a claim affects health, money, law, relationships or travel. Do not make an irreversible decision in the emotional atmosphere of a reading; revisit the record after a quiet interval.`,
      `If remedies are proposed, ask their purpose, complete cost, recipient, duration and alternatives. Prayer, charity or temple practice may be freely chosen, but fear must not become a sales tool. Never borrow for a ritual, consume an unidentified substance or delay professional care. A reading should enlarge reflection while leaving practical responsibility with the seeker.`,
    ], checklist: { title: "A grounded session leaves you able to say", lines: [
      "I know what was disclosed before matching.", "I can distinguish source, translation and commentary.", "I can reject a mismatch without pressure.", "I know the complete cost before continuing.", "I remain free to decline every remedy.", "I will verify high-stakes decisions independently."
    ] } },
    { title: "Questions worth carrying into the reading", paragraphs: [
      `Begin with questions that preserve choice. Instead of asking only “What will happen?”, ask what wording appears on the candidate leaf, which parts are conditional, what period is described and what practical evidence would confirm or challenge the interpretation. For ${s.traditionName}, also ask how the collection received its name and whether the attributed figure appears in the manuscript, an inherited catalogue or the oral account of the reader’s lineage.`,
      `For relationships, ask how consent and another person’s privacy will be protected. For work or money, ask what can be tested before making a large commitment. For health, ask the reader to avoid diagnoses and to distinguish spiritual practice from any product or treatment advice. For remedies, request the complete cost and a simpler alternative before agreeing. These questions do not diminish devotion; they prevent uncertainty from being hidden behind authority.`,
      `Finally, ask what would count as a mismatch or an incorrect interpretation. A process that can never be wrong cannot teach you much about the quality of a match. Keep the recording, transcript or notes in their original form, including uncertainty and rejected statements. Review future claims only after the stated period, without quietly changing their meaning. This creates a calmer relationship with the reading: neither automatic belief nor automatic dismissal, but careful attention to what was actually said.`,
      `Bring one trusted person into the review if the session leaves you frightened, unusually excited or ready to spend beyond your plan. A second listener can notice missing conditions, changes in wording and decisions that deserve more time. The aim is not to debate faith; it is to protect the space in which a meaningful tradition can be considered without haste, secrecy or pressure.`,
    ] },
  ];
  const faqs: Array<[string, string]> = [
    ...s.specialFaqs,
    [`How is ${s.traditionName} different from general Nadi astrology?`, `The name signals a particular sacred attribution or lineage emphasis, while the underlying palm-leaf search may still use thumb classification and candidate matching. Ask the centre what is genuinely distinctive in its collection rather than assuming a universal taxonomy.`],
    [`What makes ${s.traditionName} meaningful to seekers?`, `${s.traditionName} belongs to a living sacred tradition in which a matched leaf connects personal guidance with the wisdom attributed to a revered sage or lineage. Its value is experienced through the leaf-finding process, the Tamil recitation, careful translation and the relevance of the guidance to the seeker’s life.`],
    [`Can ${s.traditionName} be read online?`, `Some centres conduct remote matching using a photographed thumb impression and a video or phone session. Confirm privacy, deletion, language, recording, price, non-match terms and who will read and translate before sending biometric data.`],
    [`What happens if no leaf matches?`, `A no-match should remain a valid outcome. Ask which bundles were available, what was tested and whether another collection would be meaningfully different. Do not keep changing answers or supplying more biography merely to force a match.`],
    [`How are remedies presented?`, `When remedies appear in the matched guidance, they may include prayer, mantra, charity, temple worship or ritual. Guruji explains their spiritual purpose, duration and cost so the seeker can understand how the practice supports the larger reading.`],
    [`What does the NadiVedas ₹999 fee cover?`, `₹999 covers Guruji’s index-leaf search and live verification. It does not guarantee a match. If a candidate matches, any continuation bundle is separate and optional; the lineage name is not a guarantee of accuracy or outcome.`],
  ];
  return { ...s, sections, faqs };
}

export const nandiNadiArticle = build({
  slug: "nandi-nadi-astrology", traditionName: "Nandi Nadi", figureName: "Nandi", productPath: "/nandi-nadi", category: "Sages & lineages",
  title: "Nandi Nadi Astrology: Nandi, Shiva and Reading Guide", description: "Understand Nandi Nadi astrology, its Shaiva attribution, the difference from Bhrigu Nandi Nadi, reading process, themes, remedies and verification.",
  dek: "Follow Nandi from temple threshold to palm-leaf tradition—and learn why devotion, chart technique and personal-leaf matching must remain distinct.",
  image: "/images/blog-nandi-nadi-astrology-real.webp", imageAlt: "Large granite Nandi statue at Lepakshi in Andhra Pradesh", imageWidth: 1600, imageHeight: 1200,
  caption: "The granite Nandi at Lepakshi represents the sacred figure associated with the tradition; it is not a Nadi manuscript.", attributionUrl: "https://commons.wikimedia.org/wiki/File:Nandi_statue_in_lepakshi.JPG", attributionLabel: "Photograph by Vinu raj, Wikimedia Commons", licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/", licenseLabel: "CC BY-SA 3.0",
  focus: "duty, stewardship, enterprise and Shaiva devotion",
  intro: [
    "At a Shiva temple, Nandi faces the sanctum in perfect attention. Pilgrims may whisper a prayer near the great stone listener before turning toward Shiva. When the same name appears on a Nadi reading menu, it carries that atmosphere of devotion—but it also raises a precise question: does Nandi describe the sacred patron, a manuscript collection, or a chart technique?",
    "The distinction matters because “Nandi Nadi” and “Bhrigu Nandi Nadi” are often confused. One may be presented as a Tamil palm-leaf lineage located through a thumb impression; the other is widely taught as a horoscope method using planetary significators and relationships. A seeker should know which service is actually being offered before paying or sharing personal data."
  ],
  directAnswer: "Nandi Nadi astrology is a name used for traditions attributed to Nandi Deva, Shiva’s devoted attendant and teacher in Shaiva memory. Contemporary services may offer it as a thumb-impression palm-leaf search covering duty, finance, career, family karma and spiritual discipline. This is not automatically the same as Bhrigu Nandi Nadi, a chart-based predictive method. The sacred attribution belongs to tradition; a particular leaf still requires transparent matching, provenance and translation.",
  uniqueSections: [
    { title: "Who is Nandi in Shaiva tradition?", paragraphs: [
      "Nandi is commonly recognised as Shiva’s bull, vehicle and guardian, but his religious identity is richer than an animal emblem. Shaiva traditions remember him as an exemplary devotee, gatekeeper, listener and transmitter of teaching. His steady gaze toward the linga expresses attention, restraint and service—qualities that explain why a lineage bearing his name may emphasize duty and disciplined responsibility.",
      "Stories about Nandi’s birth, teachers and reception of divine knowledge vary across texts, regions and temple traditions. They should be presented as sacred narrative rather than a single modern biography. Respect for Nandi does not require claiming that every manuscript labelled with his name is an autograph or that every modern reading has the same content."
    ] },
    { title: "Nandi Nadi is not automatically Bhrigu Nandi Nadi", paragraphs: [
      "Bhrigu Nandi Nadi, often abbreviated BNN, is commonly described today as a horoscope technique that reads planets through natural significations, conjunctions, trinal relationships and progression or transit principles. It begins with birth-chart data and can be taught as a system. A Tamil palm-leaf Nandi Nadi service, by contrast, may begin with a thumb impression and candidate bundles.",
      "The shared word “Nandi” does not erase that difference. Ask whether the practitioner needs a birth time and chart, or whether a physical leaf is being searched. Ask whether the result comes from calculated planetary rules, a manuscript translation or a combination of both. Clear naming prevents a seeker from expecting a palm leaf and receiving only a chart consultation."
    ] },
    { title: "Themes traditionally associated with Nandi Nadi", paragraphs: [
      "Modern Nandi Nadi descriptions often emphasise stewardship: responsibility for family, livelihood, property, employees or an organisation. Career, enterprise, financial judgement and the consequences of authority may appear alongside devotional discipline. These are lineage descriptions, not a guaranteed table of contents for every candidate leaf.",
      "The figure of Nandi also invites a useful ethical question: what are you protecting, and whom does your decision affect? A business prediction should not become permission to ignore contracts or risk. A family-duty statement should not justify control. Spiritual discipline is healthiest when it clarifies responsibility rather than demanding blind obedience."
    ] },
    { title: "Protection and remedies without fear", paragraphs: [
      "A Nandi-labelled reading may recommend Shiva worship, visits to a temple, charity, mantra, fasting or conduct-based discipline. A seeker may find these practices meaningful. Their spiritual value does not establish that a threatened event will occur or that paying for a ritual can guarantee protection.",
      "Ask whether the remedy is written on the leaf, translated from a named passage or suggested by the practitioner. Confirm the full cost and a no-cost alternative. Devotion to Shiva or Nandi can be practised without financial pressure, secrecy or statements that refusal will bring punishment."
    ] },
  ],
  specialFaqs: [["Is Nandi Nadi the same as Bhrigu Nandi Nadi?", "Not necessarily. Bhrigu Nandi Nadi is widely taught as a birth-chart method, while a Nandi Nadi palm-leaf service may use thumb-impression matching. Ask which input, source and method the practitioner actually uses."], ["What does Nandi symbolize in this tradition?", "Nandi commonly symbolizes devotion, listening, strength, guardianship and disciplined service to Shiva. Those meanings help explain the tradition’s emphasis, but symbolism does not authenticate a particular manuscript."]],
  sources: [["Nandi Nadi service description and chapter themes", "https://www.astroved.com/nadi/nandi-nadi-astrology"], ["Introduction to Nadi astrology and named traditions", "https://www.astrosage.com/nadiastrology/"], ["Wikimedia Commons: Nandi at Lepakshi", "https://commons.wikimedia.org/wiki/File:Nandi_statue_in_lepakshi.JPG"]],
  related: [["Nandi Nadi tradition page", "/nandi-nadi"], ["Bhrigu Nadi guide", "/blogs/bhrigu-nadi-astrology"], ["How thumb matching works", "/blogs/nadi-astrology-thumb-impression"]],
});

export const shivaVakyaNadiArticle = build({
  slug: "shiva-vakya-nadi-astrology", traditionName: "Shiva Vakya Nadi", figureName: "Shiva and Parvati", productPath: "/products/shiva-nadi", category: "Sages & lineages",
  title: "Shiva Vakya Nadi Astrology: Tradition and Reading Guide", description: "Understand Shiva Vakya Nadi astrology, its Shiva–Parvati dialogue tradition, personal-leaf claims, reading process, remedies and careful verification.",
  dek: "Enter the tradition through the image of Shiva and Parvati in dialogue, while keeping sacred voice, manuscript history and personal prediction carefully distinct.",
  image: "/images/blog-shiva-vakya-nadi-astrology-real.webp", imageAlt: "Historic sculpture of Shiva and Parvati in the National Museum of Indonesia", imageWidth: 1200, imageHeight: 900,
  caption: "This museum sculpture represents Shiva and Parvati; it is not a portrait of an author or evidence for a personal palm leaf.", attributionUrl: "https://commons.wikimedia.org/wiki/File:Shiva-Parvati_Statue_6082.jpg", attributionLabel: "National Museum of Indonesia image, Wikimedia Commons", licenseUrl: "https://creativecommons.org/publicdomain/mark/1.0/", licenseLabel: "Public Domain Mark 1.0",
  focus: "Shaiva devotion, relationship, karma and spiritual counsel",
  intro: [
    "A name such as “Shiva Vakya” sounds absolute: the words of Shiva. In devotional imagination, Shiva and Parvati sit in timeless dialogue while questions of birth, karma and liberation are unfolded. For a modern seeker, however, the power of the name makes precision more important, not less. What exactly is being attributed to Shiva, and what can a reader actually show?",
    "Shiva Vakya Nadi is presented by contemporary lineages as a rare palm-leaf tradition in which sacred instruction is voiced through Shiva, sometimes in conversation with Parvati. That devotional form can shape the tone of a reading. It does not remove the need to distinguish manuscript wording, later copying, translation, practitioner explanation and the personal claims attached to one candidate leaf."
  ],
  directAnswer: "Shiva Vakya Nadi astrology is a palm-leaf reading tradition attributed to Shiva’s sacred speech, often framed as a dialogue with Parvati. Services commonly associate it with complete-life guidance, karma, relationships, spiritual purpose and remedies. The attribution is a matter of lineage and belief, not independently established authorship. A seeker should verify the actual leaf-search process, source language, translation, cost and freedom to reject a mismatch.",
  uniqueSections: [
    { title: "What does “Shiva Vakya” mean?", paragraphs: [
      "Vakya means a statement, utterance or sentence. In this context, the name presents the teaching as Shiva’s speech rather than merely a text about Shiva. Dialogue is a familiar form in Indian religious literature: divine or sage-to-disciple conversation can hold philosophy, ritual instruction and moral reflection. The form communicates authority within tradition, but it is not a modern certificate of manuscript date.",
      "A provider should be able to explain whether “Shiva Vakya” is the inherited name of a physical collection, the attributed voice inside a text, the centre’s lineage or a style of interpretation. Those possibilities are not interchangeable. A sacred title deserves a clearer provenance account than a broad claim of divine authorship."
    ] },
    { title: "Shiva and Parvati as a teaching relationship", paragraphs: [
      "The image of Shiva teaching Parvati can be approached as reciprocal sacred attention rather than a licence for hierarchy in ordinary relationships. A reading about marriage or duty should not be used to silence a partner, impose ritual or excuse coercion. Both people retain consent, privacy and the right to interpret spiritual language differently.",
      "The sculpture shown here documents how artists represented Shiva and Parvati in a historical object. It cannot depict the origin of a particular Nadi leaf. Honest visual context allows the sacred association to be felt without turning an artwork into proof of prediction."
    ] },
    { title: "What a Shiva Vakya reading may discuss", paragraphs: [
      "Descriptions of Shiva Vakya Nadi commonly promise a broad life map: family, education, marriage, children, health, profession, finance, obstacles, spiritual direction and remedies. Some distinguish a general or index chapter from continuation Kandams. The actual scope depends on the matched leaf and the collection available to the reader.",
      "Broad coverage can create the illusion that every statement must fit somewhere. Ask the reader to preserve sequence and wording. A conditional statement should remain conditional; a symbolic term should not be silently converted into a precise date; and a general spiritual principle should not be presented later as a personal prophecy."
    ] },
    { title: "Sacred authority must preserve consent", paragraphs: [
      "A claim voiced as “Shiva says” can feel difficult to question. Yet translation and interpretation still pass through human hands. A respectful practitioner welcomes clarification and does not treat doubt as sin. Declining an expensive ritual, another chapter or a prediction does not make a seeker spiritually disobedient.",
      "If fear enters the session—death, curse, divine punishment or irreversible loss—pause before paying or acting. Seek independent medical, legal or mental-health help when appropriate. Sacred counsel should support clarity and responsibility, not override them."
    ] },
  ],
  specialFaqs: [["Is Shiva Vakya Nadi literally written by Lord Shiva?", "Lineages attribute the sacred voice or teaching to Shiva, often through a dialogue with Parvati. That is a devotional claim. The physical age, copying history and authorship of a particular surviving leaf require separate manuscript evidence."], ["Is Shiva Nadi the same as Shiva Vakya Nadi?", "The names are sometimes used together or interchangeably, but centres may distinguish their collections. Ask the provider what each label means locally and whether the process or manuscripts differ."]],
  sources: [["Wikimedia Commons: Shiva–Parvati museum sculpture", "https://commons.wikimedia.org/wiki/File:Shiva-Parvati_Statue_6082.jpg"], ["Nadi astrology overview", "https://www.astrosage.com/nadiastrology/"], ["Vaitheeswaran Koil and Nadi practice", "https://en.wikipedia.org/wiki/Vaitheeswaran_Koil"]],
  related: [["Shiva Nadi tradition page", "/products/shiva-nadi"], ["Nadi history and manuscripts", "/blogs/nadi-astrology-history"], ["Are Nadi readings genuine?", "/blogs/is-nadi-astrology-genuine"]],
});

export const brahmaNadiArticle = build({
  slug: "brahma-nadi-astrology", traditionName: "Brahma Nadi", figureName: "Brahma", productPath: "/brahma-nadi", category: "Sages & lineages",
  title: "Brahma Nadi Astrology: Creation, Destiny and Reading Guide", description: "Understand Brahma Nadi astrology, its creator-deity attribution, destiny and life-purpose themes, manuscript claims, matching process and verification.",
  dek: "Explore why Brahma’s name is attached to rare destiny readings—and how to approach claims of creation, life design and purpose without surrendering evidence.",
  image: "/images/blog-brahma-nadi-astrology-real.webp", imageAlt: "Brahma temple and shrine at Pushkar in Rajasthan", imageWidth: 1200, imageHeight: 1600,
  caption: "The Brahma Temple at Pushkar documents a living place of worship, not the origin or authorship of a personal Nadi manuscript.", attributionUrl: "https://commons.wikimedia.org/wiki/File:Templo_a_Brahm%C4%81_en_Pushkar,_Rajasthan.jpg", attributionLabel: "Photograph by Pablo Nicolás Taibi Cicaré, Wikimedia Commons", licenseUrl: "https://creativecommons.org/licenses/by/2.0/", licenseLabel: "CC BY 2.0",
  focus: "life purpose, deep destiny mapping and spiritual direction",
  intro: [
    "Brahma is remembered as creator, and the name “Brahma Nadi” naturally suggests a record written at the beginning of a life. That image is spiritually powerful: a hidden design waiting to be read. It is also where careful language matters most, because a metaphor of creation can easily become a claim that every event is fixed and every choice already decided.",
    "Contemporary Brahma Nadi services often describe the tradition as rare, comprehensive and concerned with the architecture of destiny. A seeker can respect that sacred frame while asking ordinary but essential questions: what collection carries the name, how is a candidate selected, what does the leaf actually contain and which parts are the reader’s interpretation?"
  ],
  directAnswer: "Brahma Nadi astrology is a name used for rare palm-leaf traditions attributed to Brahma, the creator deity in Hindu tradition. Modern descriptions associate it with life purpose, karmic design, major life periods and comprehensive guidance. These are lineage claims, not proof that a surviving leaf was physically written by Brahma or that a person’s future is fixed. Verification still depends on a transparent search, provenance, translation and consent.",
  uniqueSections: [
    { title: "Why Brahma’s name shapes the tradition", paragraphs: [
      "Brahma’s creator role gives the lineage a distinctive vocabulary: origin, design, purpose, sequence and the unfolding of a life. In religious thought, creation does not always mean a mechanical script. It can also describe conditions, capacities and responsibilities within which choice operates. A reader should not use the deity’s name to erase human agency.",
      "Pushkar’s Brahma temple is one of the best-known places of Brahma worship. Its existence and living ritual tradition are established cultural facts. They do not authenticate a private palm-leaf archive elsewhere. Sacred geography offers context; manuscript provenance asks a different set of questions."
    ] },
    { title: "What “rare” can and cannot tell you", paragraphs: [
      "Brahma Nadi is frequently described as rare or premium. Rarity may refer to how a centre categorises its collections, how many readers can interpret them, the length of the continuation material or the reputation of the lineage. Without a catalogue, “rare” is not a measurable guarantee of antiquity, accuracy or value.",
      "Ask for the service scope in plain terms. How many candidate bundles are searched? Which chapters are included? What is the source script? Is a facsimile or recording available? What happens when no match is found? A high price should purchase clearly described work, not immunity from questions."
    ] },
    { title: "Destiny mapping without fatalism", paragraphs: [
      "A Brahma Nadi reading may be described as showing a complete life design: family, vocation, relationships, wealth, spiritual direction and turning points. Such a map can support reflection, but it should not reduce a person to a fixed outcome. Predictions are not legal orders, medical diagnoses or financial guarantees.",
      "Use a reading to identify questions rather than close them. If a career period is emphasised, compare skills, opportunities and obligations. If a relationship is described as destined, preserve mutual consent. If a spiritual purpose is named, test whether the practice brings steadiness, compassion and responsible action rather than dependency."
    ] },
    { title: "Authorship, copies and inherited attribution", paragraphs: [
      "Palm-leaf texts survive through copying. A collection may carry an inherited attribution without preserving a continuous, independently documented chain to its claimed divine origin. This does not make the tradition meaningless; it means devotional authorship and material manuscript history answer different questions.",
      "A careful centre can say, “Our lineage identifies this as Brahma Nadi,” while remaining honest about what is not known. Claims that a leaf is thousands of years old should be supported by material study, script analysis and documented custody rather than the sacred name alone."
    ] },
  ],
  specialFaqs: [["Is Brahma Nadi the rarest Nadi?", "Some centres market it as rare, but there is no universal public census of private Nadi collections. Ask what rarity means in that service—limited bundles, specialist interpretation, length or simply a premium label."], ["Does Brahma Nadi reveal a fixed life purpose?", "A reading may offer a traditional interpretation of purpose or duty. It should be treated as reflection, not an order that removes choice, consent or the need to evaluate real-world responsibilities."]],
  sources: [["Brahma Temple at Pushkar image and licence", "https://commons.wikimedia.org/wiki/File:Templo_a_Brahm%C4%81_en_Pushkar,_Rajasthan.jpg"], ["Overview mentioning Brahma Nadi among Rishi traditions", "https://www.swamisivanadi.com/types-of-rishis-nadi-astrology"], ["Nadi astrology overview", "https://www.astrosage.com/nadiastrology/"]],
  related: [["Brahma Nadi tradition page", "/brahma-nadi"], ["Nadi manuscript history", "/blogs/nadi-astrology-history"], ["Reading-cost guide", "/blogs/nadi-astrology-reading-cost"]],
});

export const atriNadiArticle = build({
  slug: "atri-nadi-astrology", traditionName: "Atri Nadi", figureName: "Atri", productPath: "/atri-nadi", category: "Sages & lineages",
  title: "Atri Nadi Astrology: Sage, Family Lineage and Reading Guide", description: "Understand Atri Nadi astrology, Maharishi Atri and Anasuya traditions, Dattatreya associations, family-karma themes, matching and verification.",
  dek: "Meet the family-centred sacred memory of Atri, Anasuya and Dattatreya, then learn what an Atri-labelled leaf can—and cannot—establish.",
  image: "/images/blog-atri-nadi-astrology-real.webp", imageAlt: "Dattatreya statue with Saraswati and Gayatri images at Muktidham in Nashik", imageWidth: 1200, imageHeight: 1600,
  caption: "This contemporary devotional statue depicts Dattatreya, traditionally associated with Atri and Anasuya; it is not an Atri Nadi leaf.", attributionUrl: "https://commons.wikimedia.org/wiki/File:Dattatreya_statue_with_Sri_maha_saraswathi_and_Sri_Gayatri_devi_idols,_Muktidham,_Nashik.jpg", attributionLabel: "Photograph by K. Venkataramana, Wikimedia Commons", licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/", licenseLabel: "CC0 1.0",
  focus: "family karma, ancestral responsibility, protection and Dattatreya devotion",
  intro: [
    "Atri is rarely remembered alone. Sacred stories bring him beside Anasuya, whose fidelity and spiritual strength are celebrated, and connect their household with Dattatreya. This family image gives Atri Nadi a distinctive emotional field: ancestry, blessing, responsibility, protection and the patterns carried from one generation to another.",
    "Modern Atri Nadi services extend that sacred memory into claims about palm leaves attributed to Maharishi Atri. The tradition can be approached respectfully without turning every family difficulty into karmic blame or every inherited attribution into settled history. The key is to separate the figure, the literature, the physical collection and the individual match."
  ],
  directAnswer: "Atri Nadi astrology is a palm-leaf reading tradition attributed to Maharishi Atri, one of the Saptarishis in Hindu sacred memory. Contemporary descriptions connect it with family karma, ancestral patterns, wellbeing, protection, spiritual growth and Dattatreya. These associations are traditional rather than independently proven authorship. A personal leaf still requires transparent thumb matching, translation and room for non-match.",
  uniqueSections: [
    { title: "Atri, Anasuya and Dattatreya in sacred memory", paragraphs: [
      "Atri appears across Indian religious literature as a revered seer, while Anasuya is honoured for spiritual power and virtue. Traditions identify Dattatreya as their son and as a form integrating Brahma, Vishnu and Shiva. The details vary across tellings, so a responsible account names them as devotional narratives rather than compressing them into one dated biography.",
      "The Dattatreya image used here documents a modern place of worship in Nashik. It illustrates the living devotional connection surrounding Atri’s family tradition. It does not show Maharishi Atri, prove the date of a manuscript or establish that a modern seeker has a prewritten leaf."
    ] },
    { title: "Why family and ancestral themes recur", paragraphs: [
      "Because Atri and Anasuya are remembered through a sacred household, Atri Nadi descriptions often emphasise parents, children, inherited duties, protection and ancestral patterns. A reading may frame repeated conflict, caregiving, illness or financial responsibility through karma. That language can be meaningful, but it must not become a weapon of blame.",
      "No leaf should be used to declare one relative spiritually inferior, responsible for another person’s illness or obligated to surrender property. Translate broad family terms carefully: biological, adoptive, step, foster and chosen relationships may not fit a single conventional category. Protect the privacy of people who did not consent to the session."
    ] },
    { title: "Healing and protection are not clinical claims", paragraphs: [
      "Atri Nadi services may discuss wellbeing, protection, blessings and remedies. These are spiritual or traditional themes. A leaf translation cannot diagnose disease, establish inherited medical risk or replace clinical testing. If a family-health concern is raised, record the wording and take symptoms or history to a qualified professional.",
      "Protection practices may include prayer, charity, worship or conduct. They should remain voluntary and proportionate. Claims that an ancestor is angry, a curse is active or a costly rite is the only solution can create fear and family conflict. Ask for a simple alternative and pause before spending."
    ] },
    { title: "A family-pattern example", paragraphs: [
      "Imagine a seeker hears that an inherited property dispute will divide siblings. Rather than treating conflict as fixed, she checks the title, survey number, tax records and each sibling’s understanding. She discovers that the schedule contains an error. Correcting it changes the practical situation without needing to decide whether the karmic interpretation was true.",
      "This is a constructive use of symbolic guidance: it identifies a place to look while evidence determines the action. The reading does not become a verdict about character, and the seeker does not disclose relatives’ private details unnecessarily."
    ] },
  ],
  specialFaqs: [["Who is Maharishi Atri?", "Atri is revered as a Vedic seer and one of the Saptarishis in later traditional lists. Devotional traditions remember Atri and Anasuya as parents of Dattatreya; exact narratives and historical dating vary."], ["Is Atri Nadi mainly about family karma?", "Many descriptions emphasize family, ancestry, protection and healing, but no universal public catalogue fixes the contents of every Atri-labelled collection. The matched leaf’s actual wording should lead."]],
  sources: [["Atri Nadi contemporary service description", "https://sivaguruswamy.com/atri-nadi-astrology-online/"], ["Atri Nadi lineage description", "https://sivayogi.com/nadi/maharishi/sri-atri-nadi-astrology/"], ["Dattatreya image and licence", "https://commons.wikimedia.org/wiki/File:Dattatreya_statue_with_Sri_maha_saraswathi_and_Sri_Gayatri_devi_idols,_Muktidham,_Nashik.jpg"]],
  related: [["Atri Nadi tradition page", "/atri-nadi"], ["Mother chapter guide", "/blogs/nadi-astrology-mother-prediction"], ["Sibling chapter guide", "/blogs/nadi-astrology-sibling-prediction"]],
});

export const dhanvantariNadiArticle = build({
  slug: "dhanvantari-nadi-astrology", traditionName: "Dhanvantari Nadi", figureName: "Dhanvantari", productPath: "/dhanvantari-nadi", category: "Sages & lineages",
  title: "Dhanvantari Nadi Astrology: Health Tradition and Safe Guide", description: "Understand Dhanvantari Nadi astrology, its healing attribution, health and remedy themes, reading process, medical boundaries and verification.",
  dek: "Approach a healing-centred Nadi with reverence and medical clarity: a sacred perspective may guide reflection, but it must never impersonate diagnosis.",
  image: "/images/blog-dhanvantari-nadi-astrology-real.webp", imageAlt: "Stone sculpture of Dhanvantari at Pragati Resorts in Telangana", imageWidth: 1200, imageHeight: 900,
  caption: "This modern Dhanvantari sculpture represents the healing deity associated with the tradition; it is not a medical record or palm leaf.", attributionUrl: "https://commons.wikimedia.org/wiki/File:Dhanvantari_sculpture.jpg", attributionLabel: "Photograph by Rajasekhar1961, Wikimedia Commons", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/", licenseLabel: "CC BY-SA 4.0",
  focus: "wellbeing, restorative discipline and voluntary spiritual remedies",
  intro: [
    "Health questions make a reading feel urgent. A seeker who is tired, frightened or waiting for test results may hear the name Dhanvantari—the divine physician—and hope that a palm leaf will explain what medicine has not. That hope deserves compassion, but also the clearest safety boundary in the Nadi library.",
    "Dhanvantari Nadi is presented as a healing-centred lineage, yet a spiritual reading is not clinical care. It may offer a traditional narrative about habits, timing, karma or remedies. It cannot examine the body, confirm a diagnosis, test a substance, calculate drug interactions or provide emergency treatment."
  ],
  directAnswer: "Dhanvantari Nadi astrology is a health-focused palm-leaf tradition attributed to Dhanvantari, the Hindu deity associated with Ayurveda and healing. Services may discuss wellbeing patterns, habits, vulnerable periods, spiritual remedies and protection. These are traditional interpretations, not medical diagnoses or scientifically validated predictions. A reading should complement reflection only; qualified healthcare must lead every medical decision.",
  uniqueSections: [
    { title: "Who is Dhanvantari?", paragraphs: [
      "Dhanvantari is revered in Hindu tradition as a divine physician and as a figure associated with Ayurveda. Iconography commonly shows him holding symbols linked with healing and immortality. Different textual and devotional traditions tell his origin in different ways, including his emergence during the churning of the ocean. These are sacred narratives, not a clinical history.",
      "Attaching Dhanvantari’s name to a Nadi lineage signals a restorative emphasis. It does not certify that a particular reader is a doctor, that a recommended product is regulated or that a manuscript can identify disease. Ask separately about the reader’s role and any practitioner’s professional qualification."
    ] },
    { title: "What a health-centred leaf may claim", paragraphs: [
      "Contemporary descriptions may include constitution, recurring illness, inherited patterns, recovery, longevity, diet, herbs or remedial worship. The precise guidance depends on the matched bundle, so the seeker should hear the original passage and its translation before deciding which parts are personally relevant.",
      "Preserve the exact wording. “Weakness,” “heat,” “obstruction” or a body-part reference may be symbolic, traditional or loosely translated. Do not let an interpreter silently turn an ambiguous phrase into a named diagnosis. If a claim worries you, take it to a qualified clinician without presenting the leaf as a test result."
    ] },
    { title: "Never consume an unidentified remedy", paragraphs: [
      "Traditional medicine can involve complex herbal, mineral or metal formulations. Safety depends on identity, composition, manufacturing quality, dose, route, interactions and the individual patient. A sacred name does not make an unidentified preparation safe. Never swallow a powder, tablet, ash, oil or liquid without a complete label and qualified review.",
      "Ask for the exact formulation name, ingredient list, manufacturer, batch, licence, dose, duration and prescriber. Disclose pregnancy, allergies, liver or kidney disease and all medicines or supplements. Do not stop prescribed treatment because a reading promises recovery. Seek urgent care for emergency symptoms rather than waiting for a ritual or follow-up reading."
    ] },
    { title: "Remedies can support meaning without claiming cure", paragraphs: [
      "Prayer, charity, temple worship, meditation or a disciplined daily routine may support hope and meaning. They should be described as spiritual practices, not guaranteed cures. A practitioner should never use worsening symptoms as proof that more ritual is required or blame the patient’s faith for a poor outcome.",
      "A useful health reading leaves the seeker more organised: symptoms documented, appointments kept, questions prepared and support requested. It does not create secrecy, delay or shame. The strongest boundary is simple—spiritual care may accompany healthcare, but it cannot replace it."
    ] },
  ],
  specialFaqs: [["Can Dhanvantari Nadi diagnose disease?", "No. A palm-leaf reading cannot perform an examination, laboratory test or validated diagnostic assessment. Record any health statement and discuss actual symptoms with a qualified healthcare professional."], ["Are Siddha or Ayurvedic remedies from a reading automatically safe?", "No. Safety depends on exact ingredients, quality, dose, interactions and the individual. Never consume an unidentified preparation or stop prescribed medicine because of a reading."]],
  sources: [["Dhanvantari Nadi contemporary description", "https://sivaguruswamy.com/sri-dhanvantari-nadi-astrology/"], ["Dhanvantari sculpture image and licence", "https://commons.wikimedia.org/wiki/File:Dhanvantari_sculpture.jpg"], ["WHO: traditional medicine overview", "https://www.who.int/news-room/questions-and-answers/item/traditional-medicine"]],
  related: [["Dhanvantari Nadi tradition page", "/dhanvantari-nadi"], ["Aushadha Kandam safety guide", "/blogs/nadi-astrology-aushadha-kandam"], ["Health-prediction guide", "/blogs/nadi-astrology-health-prediction"]],
});

export const shukraNadiArticle = build({
  slug: "shukra-nadi-astrology", traditionName: "Shukra Nadi", figureName: "Shukra", productPath: "/shukra-nadi", category: "Sages & lineages",
  title: "Shukra Nadi Astrology: Venus, Love and Prosperity Guide", description: "Understand Shukra Nadi astrology, Venus and Shukracharya associations, relationship and prosperity themes, palm-leaf versus chart methods and verification.",
  dek: "Explore love, beauty and prosperity through the Shukra tradition—without confusing desire with destiny or a planetary text with a personal palm leaf.",
  image: "/images/blog-shukra-nadi-astrology-real.webp", imageAlt: "Navagraha temple at Khargone dedicated to the nine planetary deities", imageWidth: 1600, imageHeight: 972,
  caption: "The Navagraha temple at Khargone provides visual context for planetary devotion; it is not a Shukra Nadi manuscript.", attributionUrl: "https://commons.wikimedia.org/wiki/File:Shree_Navagraha_mandir.JPG", attributionLabel: "Photograph by Prasoonpadhye, Wikimedia Commons", licenseUrl: "https://creativecommons.org/licenses/by/3.0/", licenseLabel: "CC BY 3.0",
  focus: "relationships, desire, creativity, property and responsible prosperity",
  intro: [
    "A seeker arrives with questions about love, marriage, money and the life she hopes to enjoy. The name Shukra seems to gather all four: Venus, attraction, refinement and prosperity. Yet “Shukra Nadi” can refer to more than one kind of astrological material, and that ambiguity matters before anyone promises a personal palm leaf.",
    "Some Shukra Nadi references concern planet-based Nadi texts or chart interpretation; some services present a thumb-matched palm-leaf lineage associated with Shukracharya. A clear guide must begin with method. Is the practitioner reading a calculated horoscope, translating a general astrological text or locating an individual manuscript record?"
  ],
  directAnswer: "Shukra Nadi astrology is a name associated with Nadi traditions centred on Shukra—Venus in Jyotisha and Shukracharya in sacred tradition. Themes commonly include love, marriage, attraction, creativity, income, property and comforts. The term may describe a planet-based astrological text or a personal palm-leaf service, so ask which method is used. No reading can guarantee marriage, wealth or compatibility.",
  uniqueSections: [
    { title: "Shukra as planet and teacher", paragraphs: [
      "In Jyotisha, Shukra is associated with Venus and with relationships, attraction, art, pleasure, vehicles, comforts and material refinement. In sacred narrative, Shukracharya is remembered as the teacher of the Asuras, a figure of knowledge, strategy and the power to restore life. These layers help explain why Shukra traditions combine desire with consequence.",
      "A planet is not a simple promise of luxury, and a deity or teacher is not a marketing mascot. Shukra themes can include negotiation, values, restraint and the cost of what is desired. A useful reading asks whether prosperity is sustainable and whether a relationship preserves the dignity of both people."
    ] },
    { title: "Palm leaf, chart method or general Nadi text?", paragraphs: [
      "Historical and modern lists refer to Nadi texts named after planets, including Shukra Nadi. A Jyotisha practitioner may use such a text to interpret birth-chart combinations. A palm-leaf centre may instead offer a personal search by thumb impression. The word “Nadi” alone does not tell you which transaction is occurring.",
      "Ask for the input and source. If birth time, date and place generate a chart, you are receiving calculated astrology. If a thumb impression narrows bundles and statements are tested, the claim is a personal-leaf search. If verses from a general text are applied to many charts, that is another method again. Each can be discussed honestly without blending them."
    ] },
    { title: "Love predictions must preserve consent", paragraphs: [
      "A Shukra reading may discuss marriage timing, partner characteristics, attraction, compatibility, separation or remarriage. None of these claims can bind another person. “Destined” does not replace mutual consent, and a favourable period does not justify pressure, surveillance or ignoring warning signs.",
      "Translate predictions into questions that both partners can answer: values, communication, safety, finances, family expectations and plans for children. If a reading labels someone unfaithful or karmically harmful, do not accuse them without evidence. Seek direct conversation or qualified support."
    ] },
    { title: "Prosperity is more than a promised gain", paragraphs: [
      "Income, property, vehicles, jewellery and comforts may appear in Shukra descriptions. A reading cannot verify title, affordability, investment risk or product quality. Before a purchase, examine documents, total cost, debt, insurance, maintenance and the effect on household goals.",
      "The deeper Shukra question is not only “Will I receive?” but “Can I enjoy responsibly?” A reflective reading may help clarify values and trade-offs. It should never be used to guarantee returns, sell a gemstone through fear or persuade someone to borrow for a lifestyle prediction."
    ] },
  ],
  specialFaqs: [["Is Shukra Nadi the same as Venus astrology?", "Not always. Some Shukra Nadi material is planet-centred chart interpretation, while some centres use the name for a thumb-matched palm-leaf service. Ask which input, text and method are actually used."], ["Can Shukra Nadi guarantee marriage or wealth?", "No. A reading may offer traditional timing or themes, but another person’s consent, legal and financial facts, health and changing circumstances determine real-world outcomes."]],
  sources: [["Comparison of Guru and Shukra Nadi text traditions", "https://sriagasthiyanadi.com/guru-nadi-vs-shukra-nadi-planet-based/"], ["Navagraha temple image and licence", "https://commons.wikimedia.org/wiki/File:Shree_Navagraha_mandir.JPG"], ["Nadi astrology overview mentioning planet-named texts", "https://en.wikipedia.org/wiki/Nadi_astrology"]],
  related: [["Shukra Nadi tradition page", "/shukra-nadi"], ["Marriage-prediction guide", "/blogs/nadi-astrology-marriage-prediction"], ["Wealth-prediction guide", "/blogs/nadi-astrology-wealth-prediction"]],
});

export const kakabhushundiNadiArticle = build({
  slug: "kakabhushundi-nadi-astrology", traditionName: "Kakabhushundi Nadi", figureName: "Kakabhushundi", productPath: "/kakabhushundi-nadi", category: "Sages & lineages",
  title: "Kakabhushundi Nadi Astrology: Crow Sage and Reading Guide", description: "Understand Kakabhushundi Nadi astrology, the crow-sage tradition, Rama devotion, cycles and timing themes, reading process and verification.",
  dek: "Meet the crow sage who watches ages turn, then separate sacred narrative, long-view symbolism and the practical testing of a personal leaf.",
  image: "/images/blog-kakabhushundi-nadi-astrology-real.webp", imageAlt: "Historic painting of Kakabhushundi represented as a crow sage", imageWidth: 1200, imageHeight: 1204,
  caption: "This eighteenth- or nineteenth-century painting represents Kakabhushundi in devotional art; it is not a historical portrait or Nadi leaf.", attributionUrl: "https://commons.wikimedia.org/wiki/File:Kakabhusundi.jpg", attributionLabel: "Unknown artist, Wikimedia Commons", licenseUrl: "https://creativecommons.org/publicdomain/mark/1.0/", licenseLabel: "Public Domain Mark 1.0",
  focus: "recurring patterns, career timing, long-view decisions and Rama devotion",
  intro: [
    "Kakabhushundi is remembered as a crow who has watched worlds rise and pass, a devotee whose long view turns ordinary urgency into one movement within a far greater cycle. That is why his name attracts seekers facing repeated patterns: the same conflict, the same career turn, the same decision returning in a different form.",
    "A Kakabhushundi Nadi reading is often presented as unusually far-seeing or strategic. Sacred longevity, however, should not be turned into a promise of perfect forecasting. The crow-sage narrative offers a lens on time and devotion; the personal-leaf claim still needs an observable matching process and honest boundaries."
  ],
  directAnswer: "Kakabhushundi Nadi astrology—also written Kaka Bhujandar, Kaga Bhusundi or Kaagapujandar Nadi—is a tradition attributed to the crow sage and Rama devotee Kakabhushundi. Modern descriptions emphasize long cycles, repeated karmic patterns, career, enterprise, turning points and spiritual perspective. These are lineage associations, not proof of exact prediction. Verify the collection, matching, translation and cost before accepting a personal leaf.",
  uniqueSections: [
    { title: "Who is Kakabhushundi?", paragraphs: [
      "Kakabhushundi appears in devotional literature as an extraordinary devotee and narrator of Rama’s story, often represented in crow form. Traditions describe him as witnessing repeated cosmic cycles and speaking from a perspective beyond ordinary lifespan. The narratives vary and belong to sacred literature rather than conventional biography.",
      "Tamil traditions also use spellings such as Kaga Bhujandar or Kaagapujandar and may connect the figure with Siddha memory. These spelling and regional differences should be acknowledged without manufacturing several unrelated sages. The underlying identity is recognised through the crow-sage motif and enduring devotional wisdom."
    ] },
    { title: "Why cycles and repeated patterns matter", paragraphs: [
      "The crow sage’s long view makes repetition a natural theme. A reading may describe similar obstacles returning in work, money, family or relationships. Such a pattern can be useful if translated into observable behaviour: the same kind of partnership, delayed contract, avoided conversation or untested assumption.",
      "Karma should not become a vague explanation that cannot be questioned. Define the repeating event, the choices made before it and what could be changed this time. A spiritual story about cycles gains practical value when it supports attention and learning rather than fatalism."
    ] },
    { title: "Career and enterprise claims need real milestones", paragraphs: [
      "Contemporary Kakabhushundi Nadi descriptions often emphasise career, business timing, finance and major decisions. A prediction of expansion, promotion or turning point should be separated from the evidence required to act: customer demand, written offers, licences, contracts, cash flow and family capacity.",
      "Use timing as a review date, not a guarantee. A seeker can run a small test, define a loss limit and compare the result with the original statement. If the promised event does not occur, do not let the date move indefinitely or blame insufficient faith."
    ] },
    { title: "Rama devotion and the freedom to interpret", paragraphs: [
      "Kakabhushundi’s devotion to Rama gives the tradition a spiritual centre of remembrance, humility and steadfastness. A reading may recommend recitation, worship, charity or disciplined conduct. These practices should be explained within tradition and offered without coercion.",
      "Seekers from other faiths or no faith remain entitled to respectful service. A symbolic alternative or simple ethical practice may be more appropriate. A lineage can preserve its identity without demanding that every client adopt the same theology."
    ] },
  ],
  specialFaqs: [["Are Kakabhushundi, Kaka Bhujandar and Kaagapujandar the same figure?", "They are commonly treated as variant Sanskrit, Hindi and Tamil forms associated with the crow sage and Rama devotee. Traditions differ in detail, so spelling alone should not be used to claim separate authenticated collections."], ["Is Kakabhushundi Nadi mainly for career timing?", "Many modern descriptions emphasize career, business and recurring patterns, but no universal public catalogue fixes the contents of every collection. Ask what the matched leaf actually contains."]],
  sources: [["Kaga Bhujandar Nadi contemporary overview", "https://www.vedicoracle.com/kaga-bhujandar-nadi-learnings-from-the-sacred-crow-sage/"], ["Kakabhushundi painting and public-domain record", "https://commons.wikimedia.org/wiki/File:Kakabhusundi.jpg"], ["Kaagapujandar overview", "https://en.wikipedia.org/wiki/Kaagapujandar"]],
  related: [["Kakabhushundi Nadi tradition page", "/kakabhushundi-nadi"], ["Career-prediction guide", "/blogs/nadi-astrology-career-prediction"], ["Business-prediction guide", "/blogs/nadi-astrology-business-prediction"]],
});

export const vasishtaNadiArticle = build({
  slug: "vasishta-nadi-astrology", traditionName: "Vasishta Nadi", figureName: "Vasishta", productPath: "/products/vasishtha-nadi", category: "Sages & lineages", date: "2026-08-16",
  title: "Vasishta Nadi Astrology: Sage, Dharma and Reading Guide", description: "Understand Vasishta Nadi astrology, Sage Vasishta, dharma and family themes, thumb-impression matching, remedies, evidence and careful verification.",
  dek: "Meet the Vedic sage remembered as poet, teacher and counsellor, then learn how to approach a Vasishta-labelled palm-leaf search with reverence and clear questions.",
  image: "/images/blog-vasishta-nadi-astrology-real.webp", imageAlt: "1916 Chitra Ramayana illustration showing Sage Vasishta addressing Queen Kaikeyi", imageWidth: 1200, imageHeight: 1200,
  caption: "This 1916 Chitra Ramayana illustration represents Vasishta in a Ramayana episode; it is not a portrait, manuscript author image or Nadi leaf.", attributionUrl: "https://commons.wikimedia.org/wiki/File:Vasistha_curses_Kaikeyi.jpg", attributionLabel: "Bhavan Rao Shrinivas Rao, Wikimedia Commons", licenseUrl: "https://commons.wikimedia.org/wiki/Template:PD-India", licenseLabel: "public domain in India",
  focus: "dharma, family responsibility, counsel, leadership and spiritual steadiness",
  intro: [
    "A seeker hears the name Vasishta and may picture a sage advising kings, teaching Rama or standing beside Arundhati beneath the night sky. The name carries the authority of one of India’s oldest remembered seer lineages. When it appears on a modern Nadi reading menu, however, reverence should be joined by one practical question: what does ‘Vasishta’ identify in this particular collection?",
    "That question opens a more useful path than either instant belief or dismissal. Vasishta belongs to documented Vedic textual memory as well as later sacred narrative. Vasishta Nadi, by contrast, is a traditional attribution used for palm-leaf collections and services. The two can be related without pretending that the age, custody or authorship of every surviving leaf has been independently established."
  ],
  directAnswer: "Vasishta Nadi astrology—also spelled Vasishtha, Vashishta or Vasishtar Nadi—is a palm-leaf reading tradition attributed to Sage Vasishta. Modern descriptions connect it with dharma, family responsibilities, leadership, career, relationships, karmic patterns and spiritual direction. A search may use a thumb impression to test candidate leaves. The attribution belongs to tradition; it does not by itself prove a leaf’s age, authorship or predictive accuracy.",
  uniqueSections: [
    { title: "Who is Sage Vasishta?", paragraphs: [
      "Vasishta is among the revered rishis of Vedic tradition. The seventh mandala of the Rigveda is associated with the Vasishta family of poets, while later literature remembers him in many other roles: a Saptarishi, royal priest, teacher and counsellor. These layers accumulated across texts and centuries, so they should not be flattened into one modern biography with exact dates.",
      "In the Ramayana tradition, Vasishta is linked with the royal household of Ayodhya and the education or counsel of Rama. Stories also remember Arundhati as his wife and Vishvamitra as a powerful rival who ultimately becomes a Brahmarishi. These are sacred literary traditions. They explain the moral atmosphere around the name—duty, wise counsel, restraint and reconciliation—but do not authenticate a private palm-leaf collection."
    ] },
    { title: "Why the spelling changes", paragraphs: [
      "Vasiṣṭha is transliterated into English in several ways: Vasishta, Vasishtha and Vashishta are common, while Tamil usage may produce Vasishtar. Searchers may encounter all of them. The spelling difference usually reflects transliteration or regional pronunciation, not evidence for separate sages or separate authenticated manuscript archives.",
      "A centre can still possess collections with distinct catalogue names, but that distinction should be explained through its own records. Ask whether the label appears on the manuscript, in a family catalogue, in an oral lineage or only on the current service page. Clear naming helps a seeker compare like with like."
    ] },
    { title: "Dharma is guidance, not permission to control", paragraphs: [
      "Current Vasishta Nadi descriptions often emphasize dharma, family duty, leadership, career and spiritual development. Dharma can invite a serious question about responsible action: what do I owe to family, colleagues, society and my own conscience? It should not be used as a command that removes consent or forces one person to carry every burden.",
      "If a reading says you must remain in a harmful job, surrender property, tolerate abuse or compel a family member to follow a remedy, pause. A spiritual interpretation cannot override safety, law or another person’s autonomy. Ask which words are on the leaf, which are translation and which are the practitioner’s explanation."
    ] },
    { title: "A practical example: counsel before a career decision", paragraphs: [
      "Imagine a manager is told that a period of greater authority is approaching but that family duty will test the opportunity. Instead of resigning immediately or treating promotion as guaranteed, he records the prediction and defines what would count as confirmation: a written role, compensation, location, reporting line and start date.",
      "He then discusses travel and caregiving with his family, checks the employer’s stability and compares the new role with his values. The reading becomes a prompt for complete decision-making rather than a substitute for it. If no offer arrives within the stated period, the claim stays unfulfilled; it is not silently moved to another year."
    ] },
    { title: "Arundhati, partnership and shared responsibility", paragraphs: [
      "Vasishta and Arundhati are remembered together in Hindu marriage symbolism, including the custom of pointing to the paired stars associated with them. A Vasishta-labelled reading may therefore be presented as especially attentive to marriage, household responsibility or mutual support. That association is traditional, not a guarantee that every leaf contains relationship detail.",
      "Relationship predictions must preserve two people’s freedom. A claimed future spouse is not identifiable proof about a stranger, and a statement about separation should not provoke accusation. Use the reading to discuss communication, safety, finances, caregiving and expectations; let consent and observable conduct guide the relationship."
    ] },
  ],
  specialFaqs: [
    ["Are Vasishta, Vasishtha, Vashishta and Vasishtar Nadi different?", "These are usually English or regional spelling variants of the same revered sage’s name. Individual centres may use a particular spelling for their collection, so ask how the lineage and manuscript group are identified locally."],
    ["Is Vasishta Nadi connected with the Rigveda?", "Vasishta and his family are associated with Mandala 7 of the Rigveda. A modern palm-leaf collection attributed to Vasishta is a separate provenance claim and should not be dated or authenticated merely from that Vedic association."],
    ["What themes are linked with Vasishta Nadi?", "Modern descriptions commonly mention dharma, family, leadership, career, marriage, karma and spiritual direction. No public universal catalogue fixes the contents of every Vasishta-labelled collection, so the matched leaf’s actual wording should lead."],
  ],
  sources: [
    ["Vedic Heritage Portal: Rigveda structure and mandalas", "https://vedicheritage.gov.in/samhitas/rigveda/"],
    ["Vasishta Nadi: current service description", "https://sriagasthiyanadi.com/vashishta-nadi-astrology/"],
    ["Vasishta Nadi: current thumb-matching and theme description", "https://nadiastrologyvaitheeswarankoil.com/vasishta-nadi/"],
    ["1916 Vasishta illustration and public-domain record", "https://commons.wikimedia.org/wiki/File:Vasistha_curses_Kaikeyi.jpg"],
  ],
  related: [["Vasishtha Nadi tradition page", "/products/vasishtha-nadi"], ["Nandi Nadi guide", "/blogs/nandi-nadi-astrology"], ["Atri Nadi guide", "/blogs/atri-nadi-astrology"], ["Nadi manuscript history", "/blogs/nadi-astrology-history"], ["How thumb matching works", "/blogs/nadi-astrology-thumb-impression"]],
});

export const lineageBatchArticles = [vasishtaNadiArticle, nandiNadiArticle, shivaVakyaNadiArticle, brahmaNadiArticle, atriNadiArticle, dhanvantariNadiArticle, shukraNadiArticle, kakabhushundiNadiArticle];
