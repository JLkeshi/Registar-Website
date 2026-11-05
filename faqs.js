/* ==========================================================
   REGGIE – FAQ CONTENT
   Source: City College of Calamba – Office of the College Registrar
           Citizen's Charter (2022), plus a few items still to confirm.

   Edit this file to change what Reggie says.

   - Text inside [[double brackets]] is a PLACEHOLDER (not in the
     Citizen's Charter). Reggie shows it highlighted in yellow so you
     can spot it while testing. Replace it with the real answer and
     delete the [[ ]].
   - "\n" makes a new line.
   - The form links below are the same as in script.js.
   ========================================================== */

window.REGGIE_FAQ = (function () {
  "use strict";

  /* ---------- Default placeholders (used when the Charter has no answer) ---------- */
  const TODO = {
    req:   "[[CONFIRM: List the requirements for this request, e.g. valid ID, documents to upload, signed forms.]]",
    fee:   "[[CONFIRM: State the fee (or that it is free) and how to pay.]]",
    time:  "[[CONFIRM: Number of working days to process this request.]]",
    claim: "[[CONFIRM: How it is released: pick-up at the Registrar's Office, email, or courier.]]"
  };

  const nodes = {};

  function add(id, label, answer, next, extra) {
    nodes[id] = Object.assign({ id: id, label: label, answer: answer, next: next || [] }, extra || {});
  }

  /* ---------- Build one transaction (standard questions + extras) ----------
     extras: [ [label, answer], ... ]  or an existing node id (string)       */
  function transaction(key, label, url, what, o) {
    o = o || {};
    const link = { label: o.linkLabel || "Open the form", url: url };
    const kids = [key + ".req"];

    add(key + ".req", "What are the requirements?",
        "Requirements for " + label + ":\n" + (o.req || TODO.req), [], { link: link });

    if (o.steps) {
      add(key + ".steps", "What are the steps?",
          "Steps for " + label + ":\n" + o.steps, [], { link: link });
      kids.push(key + ".steps");
    }

    add(key + ".fee", "How much does it cost?",
        "Fee for " + label + ":\n" + (o.fee || TODO.fee), [], { link: link });
    add(key + ".time", "How long does it take?",
        "Processing time for " + label + ":\n" + (o.time || TODO.time), [], { link: link });
    add(key + ".claim", o.claimLabel || "How do I get it?",
        (o.claim || TODO.claim), [], { link: link });
    kids.push(key + ".fee", key + ".time", key + ".claim");

    (o.extras || []).forEach(function (q, i) {
      if (typeof q === "string") { kids.push(q); return; }
      const id = key + ".x" + i;
      add(id, q[0], q[1], [], { link: link });
      kids.push(id);
    });

    add(key, label, what + "\n\nWhat would you like to know about it?", kids, { link: link });
  }

  /* ---------- Simple info node (no sub-questions) ---------- */
  function info(id, label, answer) { add(id, label, answer); }

  /* ==========================================================
     SHARED CERTIFICATE DETAILS (Charter: Issuance of Certificates)
     ========================================================== */
  const CERT = {
    req:   "- Documentary stamp\n- Official Receipt (issued by the Cashier after you pay)",
    steps: "1. Go to the Cashier's Office, fill out the request form and pay. The cashier issues your official receipt.\n2. Go to the Registrar's Office, present the request form and the official receipt, and wait for your claim stub.\n3. Claim your certificate.",
    fee:   "Php 50 per page.",
    time:  "- Cashier: about 5 minutes\n- Claim stub at the Registrar's Office: about 5 minutes\n- Releasing the certificate: about 15 minutes",
    claim: "Claim your certificate at the Registrar's Office after your claim stub is issued. Releasing it takes about 15 minutes."
  };

  info("certs.list", "What certificates can I request?",
    "The Registrar issues these certificates:\n- Enrollment\n- GWA (General Weighted Average)\n- Medium of Instruction\n- Graduation\n- Completion\n\nEach one costs Php 50 per page. Requirements: documentary stamp and official receipt.");

  /* ==========================================================
     CERTIFICATES & RECORDS
     ========================================================== */
  transaction("enrollment", "Certificate of Enrollment",
    "https://docs.google.com/forms/d/e/1FAIpQLSf091uwlBRVmXDcVpq0WYJFYUq1FHQbF5RLgjJAzLFxPGc2Yw/viewform",
    "A Certificate of Enrollment is an official document from the Registrar stating that you are currently enrolled at City College of Calamba. Students commonly use it for scholarships, benefits applications, and government or company requirements.",
    { req: CERT.req, steps: CERT.steps, fee: CERT.fee, time: CERT.time, claim: CERT.claim,
      extras: [
        "certs.list",
        ["How many copies can I request?", "[[CONFIRM: Number of copies allowed per request.]]"]
      ] });

  transaction("graduation", "Certificate of Graduation",
    "https://docs.google.com/forms/d/e/1FAIpQLSf1_J5gfBsVhgMa9iGBUIlpV2n_A1SQrXUFDd6OkzBuXpTxXg/viewform",
    "A Certificate of Graduation certifies that you completed all requirements of your degree program and graduated from City College of Calamba. It is commonly used for job applications and other employment or school requirements.",
    { req: CERT.req, steps: CERT.steps, fee: CERT.fee, time: CERT.time, claim: CERT.claim,
      extras: [
        "certs.list",
        "grad.clearance",
        ["When can I request it?", "[[CONFIRM: Eligibility, e.g. after the graduation list is approved or after clearance is complete.]]"]
      ] });

  transaction("tor", "Form 137-A / Transcript of Records",
    "https://docs.google.com/forms/d/e/1FAIpQLSeYzAXg5go0nyN7nMqM4GXb8HWv93eHm8iYBRiL6gumHvTeeA/viewform",
    "Your Transcript of Records (TOR), also called Form 137-A, is the official record of the subjects you took, with your grades and units. It is commonly needed for transferring schools, job applications, board exams, scholarships and studying abroad.",
    { req: "- Documentary stamp\n- Official Receipt (issued by the Cashier after you pay)",
      steps: "1. Go to the Cashier's Office, fill out the request form and pay. The cashier issues your official receipt.\n2. Go to the Registrar's Office, present the request form and the official receipt, and wait for your claim stub.\n3. Claim your TOR on the date written on the claim stub.",
      fee: "Php 50 per page.",
      time: "- Cashier: about 5 minutes\n- Claim stub at the Registrar's Office: about 5 minutes\n- Releasing the TOR: 7 days (claim it on the date on your claim stub)",
      claim: "Claim your TOR at the Registrar's Office on the date written on your claim stub, which is 7 days after your request.",
      extras: [
        "other.grades",
        ["Can I request a TOR for evaluation only?", "[[CONFIRM: Whether an \"evaluation only\" or \"copy for\" TOR is offered and how it differs from the official TOR.]]"],
        ["Can the TOR be sent directly to another school?", "[[CONFIRM: Whether the Registrar can send it directly to the receiving school or employer, and how to arrange this.]]"],
        ["Why can't I get my TOR yet?", "[[CONFIRM: Common reasons for holds, e.g. unsettled accounts, incomplete grades, or pending clearance.]]"]
      ] });

  transaction("transfer", "Certificate of Transfer / Honorable Dismissal",
    "https://docs.google.com/forms/d/e/1FAIpQLSeyfiij2evNzmSNOYeiUtiPX_E3viDzNS0kTcd8PO1_IKR_nw/viewform",
    "The Certificate of Transfer / Honorable Dismissal certifies that you are leaving the college in good standing so that you may transfer to another school. The receiving school normally asks for it.",
    { extras: [
        ["What else do I need when transferring?", "Transferring students are commonly asked for an Honorable Dismissal and a Transcript of Records (see \"Form 137-A / Transcript of Records\" for its requirements, fee and release time), and may need an Exit Clearance.\n[[CONFIRM: The exact documents the college requires before releasing the Honorable Dismissal, and its fee and processing time. The Citizen's Charter does not list them.]]"]
      ] });

  /* ==========================================================
     STUDENT STATUS FORMS
     ========================================================== */
  transaction("dropping", "Dropping Form",
    "https://docs.google.com/forms/d/e/1FAIpQLSchTK7uHYYt8il1A6fC5y8rcBRKJCJahMJFubtDuMKXgsra5w/viewform",
    "The Dropping Form is used to officially withdraw from one or more subjects you are enrolled in. Simply stopping attendance without filing it can affect your grades and record, so always file it officially.",
    { req: "- Dropping form\n- Official receipt",
      steps: "1. Go to the Registrar's Office and get a dropping form. Keep a copy of your dropping form.\n2. Fill out the form, then pay at the Cashier's Office. You will be issued an official receipt.\n3. Return to the Registrar's Office and submit the accomplished dropping form. The staff will receive and file it.",
      fee: "Php 25 per subject.",
      time: "About 5 minutes for each of the 3 steps (around 15 minutes in total).",
      claimLabel: "How will I know it is processed?",
      claim: "After you submit your accomplished dropping form, the Registrar's staff receive and file it. Keep your own copy of the form and your official receipt.\n[[CONFIRM: Whether students are notified once the drop is recorded.]]",
      extras: [
        ["Is there a deadline for dropping?", "[[CONFIRM: The last day for dropping subjects each semester.]]"],
        ["Do I need approval from my instructor or adviser?", "[[CONFIRM: Required signatures or approvals before the Registrar processes the drop.]]"],
        ["Will I get a refund?", "[[CONFIRM: Refund policy for dropped subjects, if any, and which office handles it.]]"]
      ] });

  transaction("loa", "Leave of Absence (LOA) Form",
    "https://docs.google.com/forms/d/e/1FAIpQLScvb7W7LfmLGvDgwwqf7ItEJPkuVqMsrGsVx74hsMfG_ZmWaQ/viewform",
    "A Leave of Absence (LOA) is a formal request to pause your studies for a semester or more instead of simply stopping attendance. Filing it properly helps keep your status with the college clear.",
    { req: "- Dropping form\n- Official receipt\n\nThe LOA form itself is issued by the Registrar's staff. You fill it out and sign it.",
      steps: "1. Go to the Registrar's Office to get the LOA form. Fill it out and sign it. The staff will issue the LOA and dropping forms.\n2. Fill out the forms, then pay at the Cashier's Office. You will be issued an official receipt.\n3. Return to the Registrar's Office, submit the LOA form and secure your copy.",
      fee: "Php 25 per subject.",
      time: "About 5 minutes for each of the 3 steps (around 15 minutes in total).",
      claimLabel: "Do I get a copy of my LOA?",
      claim: "Yes. When you submit your LOA form at the Registrar's Office, you secure your own copy. Keep it, because it is required when you apply for a returning clearance.",
      extras: [
        ["How long can my leave be?", "[[CONFIRM: Maximum length of an LOA and how to extend it.]]"],
        ["What do I do when I want to come back?", "When you return, you will need a returning clearance. Your LOA is one of its requirements. See \"Application for Exit Clearance\" for how clearances are filed, and \"Application for Returning Student\" for readmission.\n[[CONFIRM: Any other steps for re-entering after an LOA.]]"]
      ] });

  transaction("returning", "Application for Returning Student",
    "https://docs.google.com/forms/d/e/1FAIpQLSfkd2PKublK5vVo5q0Bxzam7Aglxi1QAj1aNsnbz_pHpZdxLg/viewform",
    "This application is for students who stopped attending or were away from the college and now want to continue their studies at City College of Calamba. In the Citizen's Charter it is handled together with late enrollment and shifting.",
    { req: "- Evaluation form\n- Official receipt\n- 2x2 picture (for shiftees only)",
      steps: "1. Go to the Registrar's Office and get a request form.\n2. Fill out the form and pay at the Cashier. You will be issued an official receipt.\n3. Return to the Registrar's Office, submit the request form and the official receipt, and claim your form/s.\n4. Fill out the form/s and return them to the Registrar's Office. The staff will receive and file them.",
      fee: "Php 100.",
      time: "About 5 minutes for each of the 4 steps (around 20 minutes in total).",
      claimLabel: "What happens after I submit?",
      claim: "The Registrar's staff receive and file your accomplished forms.\n[[CONFIRM: How you are told that your readmission is approved and when you may enroll.]]",
      extras: [
        ["Do I need a returning clearance?", "The Citizen's Charter lists a returning clearance among the clearances filed at the Registrar's Office. If you took a leave of absence, your LOA is a requirement for it. See \"Application for Exit Clearance\" for the steps."],
        ["Who needs to apply as a returning student?", "[[CONFIRM: Who qualifies, e.g. students who did not enroll for one or more semesters without a filed LOA.]]"],
        ["Will my previous grades carry over?", "[[CONFIRM: How previous subjects and grades are treated for returning students.]]"],
        ["When is the application period?", "[[CONFIRM: Application dates or deadlines.]]"]
      ] });

  /* ==========================================================
     CLEARANCE & CHED
     ========================================================== */
  transaction("exit", "Application for Exit Clearance",
    "https://docs.google.com/forms/d/e/1FAIpQLSdabpg2aUjCSom_vd7hKhUYuUI3-nvFtNNUyeEOgkoTKH8fbA/viewform",
    "An Exit Clearance confirms that you have settled your obligations with the college's offices before you leave, graduate or transfer. The Registrar's Office handles both exit clearances and returning clearances.",
    { req: "- Dropping form (if applicable)\n- LOA (for a returning clearance)",
      steps: "1. Go to the Registrar's Office to file for your exit or returning clearance. Sign and complete the form. The staff will issue the clearance.\n2. Return to the Registrar's Office, submit the form and wait for your copy. The staff will receive and file the clearance.",
      fee: "Free. No fee is listed in the Citizen's Charter.",
      time: "About 5 minutes for each of the 2 steps (around 10 minutes in total).",
      claimLabel: "How will I get my copy?",
      claim: "After you submit the completed form at the Registrar's Office, wait for your copy. The staff will receive and file the clearance and give you your copy.",
      extras: [
        ["What is a returning clearance?", "A returning clearance is filed at the Registrar's Office the same way as an exit clearance, for students coming back to the college. Your LOA is a requirement if you took a leave of absence."],
        ["Which offices need to clear me?", "[[CONFIRM: List of offices, e.g. library, laboratory, accounting, guidance, department.]]"],
        ["What if one office has not cleared me?", "[[CONFIRM: What to do if an office has a pending obligation or hold.]]"]
      ] });

  transaction("ecav", "eCAV",
    "https://onetouch.ched.gov.ph/app/login",
    "eCAV (Electronic Certification, Authentication and Verification) is processed through the CHED One Touch portal. It is used when your school records need to be certified or verified by CHED, for example for employment or studying abroad.\n\nUnlike the other services, this one opens CHED's own website, where you log in with your own account.",
    { linkLabel: "Open CHED One Touch",
      claimLabel: "How do I get my eCAV?",
      extras: [
        ["Who needs an eCAV?", "[[CONFIRM: Who is expected to request an eCAV, e.g. graduates applying for work or study abroad.]]"],
        ["Do I need documents from the Registrar first?", "[[CONFIRM: Documents or certifications the Registrar must issue before you apply on CHED One Touch.]]"],
        ["I can't log in to CHED One Touch.", "Account and login concerns for the portal are handled through CHED's One Touch system, so please use the portal's own help or password recovery options.\nFor steps that involve the Registrar's Office, tap \"Contact the Registrar\" in the main menu."]
      ] });

  info("grad.clearance", "How do I apply for graduation clearance?",
    "Application of Clearance for Graduating Students\n\nRequirements:\n- Application for graduation stub\n- 2 documentary stamps\n\nSteps:\n1. Fill out the online form. The staff will give you a schedule of appointment.\n2. Go to the Registrar's Office to submit the requirements. The staff will collect them.\n\nFee: Free (none listed in the Citizen's Charter).\nProcessing time: about 5 minutes per step.");

  /* ==========================================================
     ENROLLMENT & PRE-REGISTRATION
     ========================================================== */
  info("enr.regular", "Enrollment for regular & freshmen students",
    "Enrollment for Regular and Freshmen Students\n\nSteps:\n1. Fill out the Online Registration.\n2. Pick up your Registration Form from the Registrar's Office.\n\nThe Registrar's staff enroll students who pre-registered (about 5 minutes), then prepare and print the registration form (about 20 minutes).\n\nFee: Free (N/A in the Citizen's Charter).");

  info("enr.irregular", "Enrollment for irregular & transferee students",
    "Enrollment for Irregular and Transferee Students\n\nRequirements:\n- Student ID\n- Comp cards\n- TOR (for transferees)\n\nSteps:\n1. Fill out the Online Registration. The staff give the list to the Director (about 5 minutes).\n2. Go to the Office of the Director for evaluation and adding of subjects. The Director evaluates you and gives your study load (about 15 minutes).\n3. Get your Registration Form from the Registrar's Office. The staff encode your study load and print the form (about 5 minutes).\n\nFee: Free (N/A in the Citizen's Charter).");

  info("enr.pre", "Pre-registration for entering freshmen & transferees",
    "Pre-registration for Entering Freshmen and Transferees\n\nRequirements:\n- Form 138 / Transcript of Records (transferees)\n- Form 137 / Copy of Grades (transferees)\n- Honorable Dismissal (transferees)\n- NSO/PSA Birth Certificate\n- Personal Information Sheet\n- Admission Slip\n- Good Moral\n- Barangay Clearance\n\nSteps:\n1. Fill out the online pre-registration on the CCCRegs Facebook page to receive the schedule for submitting your requirements (about 5 minutes).\n2. Go to the Registrar's Office on your schedule to submit your requirements and get your ID number and enrollment stub (about 10 minutes).\n\nFee: Free (N/A in the Citizen's Charter).");

  /* ==========================================================
     OTHER RECORDS & SERVICES (from the Citizen's Charter)
     ========================================================== */
  info("other.grades", "Copy of Grades",
    "Issuance of Copy of Grades\n\nRequirements:\n- Documentary stamp\n- Official Receipt\n\nSteps:\n1. Go to the Cashier's Office, fill out the request form and pay. You will be issued an official receipt.\n2. Go to the Registrar's Office, present the request form and the receipt, and wait for your claim stub.\n3. Claim your copy of grades on the date written on the claim stub.\n\nFee: Php 30.\nProcessing time: about 5 minutes at the Cashier, about 5 minutes for the claim stub, and 7 days before release.");

  info("other.auth", "Authentication of documents",
    "Authentication of Documents\n\nRequirements:\n- Original copy of the document\n- Photocopy of the document to be authenticated\n- Official Receipt\n\nSteps:\n1. Go to the Cashier's Office, fill out the request form and pay. You will be issued an official receipt.\n2. Go to the Registrar's Office, present the request form and the receipt, and wait for your document to be released.\n\nFee: Php 30 per document.\nProcessing time: about 5 minutes per step.");

  info("other.second", "Second copy of Registration Form, Comp Card or Diploma",
    "Request for Second Copy (Registration Form, Comp Card, Diploma)\n\nRequirements:\n- Request form\n- Official Receipt\n- Documentary stamp (for the diploma)\n\nSteps:\n1. Go to the Cashier's Office, fill out the request form and pay. You will be issued an official receipt.\n2. Go to the Registrar's Office, present the request form and the receipt, and wait for the document to be released.\n\nFees:\n- Registration Form: Php 100\n- Comp Card: Php 50\n- Diploma: Php 300\n\nProcessing time: about 5 minutes at the Cashier. At the Registrar's Office, about 10 minutes for the Registration Form or Comp Card, and 14 days for the Diploma.");

  info("other.completion", "Completion Form",
    "Request for Completion Form\n\nRequirements:\n- Request form\n- Official Receipt\n\nSteps:\n1. Go to the Cashier's Office, fill out the request form and pay. You will be issued an official receipt.\n2. Go to the Registrar's Office, present the request form and the receipt, and wait for your document to be released.\n\nFee: Php 50.\nProcessing time: about 5 minutes per step.");

  info("other.petition", "Petition for opening of a subject",
    "Petition of Opening of Subject\n\nSteps:\n1. Go to the Registrar's Office to get the petition form.\n2. Fill it out, sign it and submit it. The staff will receive and file the petition.\n\nRequirements: none listed.\nFee: Free (none listed in the Citizen's Charter).\nProcessing time: about 5 minutes per step.");

  info("other.change", "Request for change of grade",
    "Request for Change of Grade\n\nWho may request: students or teachers.\n\nRequirements:\n- Letter for change of grade\n- Attachment/s (supporting documents)\n\nSteps:\n1. Submit your letter and supporting documents at the Registrar's Office no later than 1 month after the submission of grades. The College Registrar reviews them and may request an audience with the APC if needed.\n2. You will receive a copy of the resolution. The College Registrar presents it to the concerned faculty and makes the necessary changes to the grades.\n\nFee: Free (none listed in the Citizen's Charter).\nProcessing time: up to 1 month.");

  info("other.faculty", "Submission of grades (for faculty)",
    "Submission of Grades by the Faculty\n\nFor teachers only.\n\nRequirement: Grade sheet\n\nSteps:\n1. Submit the grades online through the E-Guro Learning Management System. The Registrar's staff will print the grade sheets.\n2. Sign the grade sheets on the date set by the Registrar's Office. The staff will announce the date.\n\nFee: Free.\nProcessing time: about 5 minutes per step.");

  /* ==========================================================
     GENERAL QUESTIONS
     ========================================================== */
  add("g.how", "How do I request a document online?",
    "It is simple:\n1. Choose your service on the main page.\n2. Fill out the Google Form completely and accurately.\n3. Submit it and wait for the Registrar's Office to process your request.\n\nEach service opens the official form in a new tab. For the exact steps, fees and requirements of each service, ask Reggie about that service.");

  add("g.office", "Do I still need to go to the Registrar's Office?",
    "Many services listed in the Citizen's Charter involve paying at the Cashier's Office and claiming your document at the Registrar's Office.\n[[CONFIRM: Which steps are now done online through the forms and which still need an office visit, including how payment is made for online requests.]]");

  add("g.which", "Which form should I choose?",
    "Here is a quick guide:\n- Proof that you are enrolled: Certificate of Enrollment\n- Proof that you graduated: Certificate of Graduation\n- Your grades and subjects: Transcript of Records\n- Moving to another school: Honorable Dismissal (and usually a TOR)\n- Removing a subject: Dropping Form\n- Pausing your studies: Leave of Absence\n- Coming back after a break: Application for Returning Student\n- Leaving or graduating and settling obligations: Exit Clearance\n- CHED certification or verification: eCAV");

  add("g.who", "Who can request?",
    "According to the Citizen's Charter, these services are for students. A few are for teachers, such as submission of grades. A change of grade can be requested by either a teacher or a student.\n[[CONFIRM: Whether graduates, alumni, former students or authorized representatives may also request.]]");

  add("g.fee", "How much do the services cost?",
    "Fees from the Citizen's Charter:\n- Certificates (Enrollment, GWA, Medium of Instruction, Graduation, Completion): Php 50 per page\n- Transcript of Records: Php 50 per page\n- Copy of Grades: Php 30\n- Dropping of subjects: Php 25 per subject\n- Leave of Absence: Php 25 per subject\n- Late enrollment, readmission and shifting: Php 100\n- Authentication of documents: Php 30 per document\n- Second copy: Registration Form Php 100, Comp Card Php 50, Diploma Php 300\n- Completion Form: Php 50\n\nFree: enrollment, pre-registration, exit/returning clearance, graduation clearance, and petition for opening of a subject.\n\nFor the Honorable Dismissal and eCAV, please ask Reggie about that service.");

  add("g.time", "How long does processing take?",
    "Processing times from the Citizen's Charter:\n- Transcript of Records: 7 days\n- Copy of Grades: 7 days\n- Certificates: about 15 minutes to release\n- Diploma (second copy): 14 days\n- Registration Form or Comp Card (second copy): about 10 minutes\n- Dropping, LOA, clearances, authentication and most other forms: about 5 minutes per step\n- Change of grade: up to 1 month\n\nAsk Reggie about a specific service to see its full breakdown.");

  add("g.status", "How will I know the status of my request?",
    "[[CONFIRM: How requests are communicated, e.g. email notification, Facebook page announcement, or checking with the office.]]");

  add("g.claim", "How will I receive my document?",
    "For documents such as the TOR, Copy of Grades and certificates, the Citizen's Charter says you present the request form and official receipt at the Registrar's Office, receive a claim stub, and claim the document on the date written on the stub.\n[[CONFIRM: Other release options (email or courier) and what to bring when claiming.]]");

  add("g.proxy", "Can someone request or claim for me?",
    "[[CONFIRM: Whether a representative may request or claim on your behalf, and what they must bring, e.g. authorization letter, your valid ID, their valid ID.]]");

  add("g.hours", "What are the office hours and where is the office?",
    "[[CONFIRM: Registrar's Office location, days and hours, and any break or holiday schedules.]]");

  /* ==========================================================
     PROBLEMS & TIPS
     ========================================================== */
  add("t.signin", "The form asks me to sign in",
    "Some forms need a Google account to open or submit. Sign in with your Google account and try again.\n[[CONFIRM: Whether students must use their school email (@ccc.edu.ph) or may use a personal Google account.]]");

  add("t.open", "The form or link won't open",
    "Try these steps:\n1. Check your internet connection.\n2. Refresh the page or try another browser.\n3. Make sure pop-ups are not blocked, because forms open in a new tab.\n4. If it still does not work, tap \"Contact the Registrar\" and tell us which service you were trying to open.");

  add("t.wrong", "I made a mistake in my submission",
    "Whether a response can be edited depends on how the form is set up. Please contact the Registrar and include your full name and the request you submitted so it can be corrected.\n[[CONFIRM: The preferred way to report a correction and what details to include.]]");

  add("t.noreply", "I haven't heard back about my request",
    "Please check the processing time for your service first (see that service's \"How long does it take?\" or the general processing times).\nIf the usual time has passed, contact the Registrar and include your full name, student number and the request you submitted.\n[[CONFIRM: What details to include and which email to use for follow-ups.]]");

  add("t.tips", "Tips for a smooth request",
    "- Use your complete name exactly as it appears in your school records.\n- Double-check your student number, program and contact details.\n- Prepare any required documents, documentary stamps and your official receipt before going to the Registrar's Office.\n- Submit only once per request.\n- Keep a screenshot or copy of what you submitted, and keep your receipts and claim stubs.");

  /* ==========================================================
     CONTACT
     ========================================================== */
  add("contact", "Contact the Registrar",
    "For anything Reggie can't answer, you can reach the Registrar's Office by email or through our Facebook page. Tap the button below to see the contact details.",
    [], { action: "contact" });

  /* ==========================================================
     MAIN MENU (categories)
     ========================================================== */
  add("cat.general", "How online requests work",
    "Here are common questions about the process. Which one would you like to know about?",
    ["g.how", "g.office", "g.which", "g.who", "g.fee", "g.time", "g.status", "g.claim", "g.proxy", "g.hours"]);

  add("cat.enroll", "Enrollment & pre-registration",
    "Which enrollment process do you need help with?",
    ["enr.regular", "enr.irregular", "enr.pre"]);

  add("cat.records", "Certificates & records",
    "Which certificate or record do you need help with?",
    ["enrollment", "graduation", "tor", "transfer", "certs.list", "other.grades", "other.auth", "other.second", "other.completion"]);

  add("cat.status", "Dropping, LOA & returning",
    "Which student status request do you need help with?",
    ["dropping", "loa", "returning", "other.petition", "other.change"]);

  add("cat.clearance", "Clearance & eCAV",
    "Which one do you need help with?",
    ["exit", "grad.clearance", "ecav"]);

  add("cat.help", "Problems & tips",
    "Sorry you're having trouble. What's happening?",
    ["t.signin", "t.open", "t.wrong", "t.noreply", "t.tips"]);

  add("cat.faculty", "For faculty",
    "Here is the process for teachers:",
    ["other.faculty", "other.change"]);

  return {
    greeting: "Hi! I'm Reggie, the Registrar's virtual assistant. I can answer common questions about processing your requests, forms and clearances, including their requirements, fees and processing times.\n\nWhat would you like to know?",
    rootPrompt: "What else can I help you with?",
    root: ["cat.general", "cat.enroll", "cat.records", "cat.status", "cat.clearance", "cat.faculty", "cat.help", "contact"],
    nodes: nodes
  };
})();
