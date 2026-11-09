/* ==========================================================
   REGGIE – FAQ CONTENT
   Source: City College of Calamba – Office of the College Registrar
           Citizen's Charter (2022), plus a few items still to confirm.

   Edit this file to change what Reggie says.

   - {{OFFICE}} = Reggie says sorry and sends the student to the Office
     of the College Registrar. Use it ONLY when the Citizen's Charter has
     no answer at all. The message is defined below (OFFICE_MSG).
     To give a real answer later, replace the token with the actual text.
   - "\n" makes a new line.
   - The form links below are the same as in script.js.
   ========================================================== */

window.REGGIE_FAQ = (function () {
  "use strict";

  /* ---------- Defaults (used when the Charter has no answer) ---------- */
  const TODO = {
    req:   "{{OFFICE}}",
    fee:   "{{OFFICE}}",
    time:  "{{OFFICE}}",
    claim: "{{OFFICE}}"
  };

  /* ---------- Message used whenever the Citizen's Charter has no answer ----------
     Change the wording here and it updates everywhere.                           */
  const OFFICE_MSG = "I'm sorry, I don't have that information yet. \uD83D\uDE4F\n\nPlease visit the Office of the College Registrar so the staff can further assist you.";

  const nodes = {};

  function add(id, label, answer, next, extra) {
    answer = answer.replace(/\{\{OFFICE\}\}/g, OFFICE_MSG);
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
        ["How many copies can I request?", "{{OFFICE}}"]
      ] });

  transaction("graduation", "Certificate of Graduation",
    "https://docs.google.com/forms/d/e/1FAIpQLSf1_J5gfBsVhgMa9iGBUIlpV2n_A1SQrXUFDd6OkzBuXpTxXg/viewform",
    "A Certificate of Graduation certifies that you completed all requirements of your degree program and graduated from City College of Calamba. It is commonly used for job applications and other employment or school requirements.",
    { req: CERT.req, steps: CERT.steps, fee: CERT.fee, time: CERT.time, claim: CERT.claim,
      extras: [
        "certs.list",
        "grad.clearance",
        ["When can I request it?", "{{OFFICE}}"]
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
        ["Can I request a TOR for evaluation only?", "{{OFFICE}}"],
        ["Can the TOR be sent directly to another school?", "{{OFFICE}}"],
        ["Why can't I get my TOR yet?", "{{OFFICE}}"]
      ] });

  transaction("transfer", "Certificate of Transfer / Honorable Dismissal",
    "https://docs.google.com/forms/d/e/1FAIpQLSeyfiij2evNzmSNOYeiUtiPX_E3viDzNS0kTcd8PO1_IKR_nw/viewform",
    "The Certificate of Transfer / Honorable Dismissal certifies that you are leaving the college in good standing so that you may transfer to another school. The receiving school normally asks for it.",
    { extras: [
        ["What else do I need when transferring?", "Transferring students are commonly asked for an Honorable Dismissal and a Transcript of Records (see \"Form 137-A / Transcript of Records\" for its requirements, fee and release time), and may need an Exit Clearance."]
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
      claim: "After you submit your accomplished dropping form, the Registrar's staff receive and file it. Keep your own copy of the form and your official receipt.",
      extras: [
        ["Is there a deadline for dropping?", "{{OFFICE}}"],
        ["Do I need approval from my instructor or adviser?", "{{OFFICE}}"],
        ["Will I get a refund?", "{{OFFICE}}"]
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
        ["How long can my leave be?", "{{OFFICE}}"],
        ["What do I do when I want to come back?", "When you return, you will need a returning clearance. Your LOA is one of its requirements. See \"Application for Exit Clearance\" for how clearances are filed, and \"Application for Returning Student\" for readmission."]
      ] });

  transaction("returning", "Application for Returning Student",
    "https://docs.google.com/forms/d/e/1FAIpQLSfkd2PKublK5vVo5q0Bxzam7Aglxi1QAj1aNsnbz_pHpZdxLg/viewform",
    "This application is for students who stopped attending or were away from the college and now want to continue their studies at City College of Calamba. In the Citizen's Charter it is handled together with late enrollment and shifting.",
    { req: "- Evaluation form\n- Official receipt\n- 2x2 picture (for shiftees only)",
      steps: "1. Go to the Registrar's Office and get a request form.\n2. Fill out the form and pay at the Cashier. You will be issued an official receipt.\n3. Return to the Registrar's Office, submit the request form and the official receipt, and claim your form/s.\n4. Fill out the form/s and return them to the Registrar's Office. The staff will receive and file them.",
      fee: "Php 100.",
      time: "About 5 minutes for each of the 4 steps (around 20 minutes in total).",
      claimLabel: "What happens after I submit?",
      claim: "The Registrar's staff receive and file your accomplished forms.",
      extras: [
        ["Do I need a returning clearance?", "The Citizen's Charter lists a returning clearance among the clearances filed at the Registrar's Office. If you took a leave of absence, your LOA is a requirement for it. See \"Application for Exit Clearance\" for the steps."],
        ["Who needs to apply as a returning student?", "{{OFFICE}}"],
        ["Will my previous grades carry over?", "{{OFFICE}}"],
        ["When is the application period?", "{{OFFICE}}"]
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
        ["Which offices need to clear me?", "{{OFFICE}}"],
        ["What if one office has not cleared me?", "{{OFFICE}}"]
      ] });

  transaction("ecav", "eCAV",
    "https://onetouch.ched.gov.ph/app/login",
    "eCAV (Electronic Certification, Authentication and Verification) is processed through the CHED One Touch portal. It is used when your school records need to be certified or verified by CHED, for example for employment or studying abroad.\n\nUnlike the other services, this one opens CHED's own website, where you log in with your own account.",
    { linkLabel: "Open CHED One Touch",
      claimLabel: "How do I get my eCAV?",
      extras: [
        ["Who needs an eCAV?", "{{OFFICE}}"],
        ["Do I need documents from the Registrar first?", "{{OFFICE}}"],
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

  /* ==========================================================
     GENERAL QUESTIONS
     ========================================================== */
  add("g.how", "How do I request a document online?",
    "It is simple:\n1. Choose your service on the main page.\n2. Fill out the Google Form completely and accurately.\n3. Submit it and wait for the Registrar's Office to process your request.\n\nEach service opens the official form in a new tab. For the exact steps, fees and requirements of each service, ask Reggie about that service.");

  add("g.office", "Do I still need to go to the Registrar's Office?",
    "Yes. According to the Citizen's Charter, every service has at least one step at the Registrar's Office, such as getting or submitting a form, or claiming your document.\n\nPayments are NOT made directly to the Registrar's Office. Always pay at the Cashier's Office first, then present your official receipt at the Registrar's Office.\n\nServices with a fee (pay at the Cashier):\n- Certificates: Php 50 per page\n- Transcript of Records: Php 50 per page\n- Copy of Grades: Php 30\n- Authentication of documents: Php 30 per document\n- Second copy: Registration Form Php 100, Comp Card Php 50, Diploma Php 300\n- Completion Form: Php 50\n- Late enrollment, readmission and shifting: Php 100\n- Dropping of subjects: Php 25 per subject\n- Leave of Absence: Php 25 per subject\n\nServices with no payment:\n- Enrollment and pre-registration\n- Exit and returning clearance\n- Graduation clearance\n- Petition for opening of a subject");

  add("g.which", "Which form should I choose?",
    "Here is a quick guide:\n- Proof that you are enrolled: Certificate of Enrollment\n- Proof that you graduated: Certificate of Graduation\n- Your grades and subjects: Transcript of Records\n- Moving to another school: Honorable Dismissal (and usually a TOR)\n- Removing a subject: Dropping Form\n- Pausing your studies: Leave of Absence\n- Coming back after a break: Application for Returning Student\n- Leaving or graduating and settling obligations: Exit Clearance\n- CHED certification or verification: eCAV");

  add("g.who", "Who can request?",
    "According to the Citizen's Charter, these services are for students.");

  add("g.fee", "How much do the services cost?",
    "Fees from the Citizen's Charter:\n- Certificates (Enrollment, GWA, Medium of Instruction, Graduation, Completion): Php 50 per page\n- Transcript of Records: Php 50 per page\n- Copy of Grades: Php 30\n- Dropping of subjects: Php 25 per subject\n- Leave of Absence: Php 25 per subject\n- Late enrollment, readmission and shifting: Php 100\n- Authentication of documents: Php 30 per document\n- Second copy: Registration Form Php 100, Comp Card Php 50, Diploma Php 300\n- Completion Form: Php 50\n\nFree: enrollment, pre-registration, exit/returning clearance, graduation clearance, and petition for opening of a subject.\n\nFor the Honorable Dismissal and eCAV, please ask Reggie about that service.");

  add("g.time", "How long does processing take?",
    "Processing times from the Citizen's Charter:\n- Transcript of Records: 7 days\n- Copy of Grades: 7 days\n- Certificates: about 15 minutes to release\n- Diploma (second copy): 14 days\n- Registration Form or Comp Card (second copy): about 10 minutes\n- Dropping, LOA, clearances, authentication and most other forms: about 5 minutes per step\n\nAsk Reggie about a specific service to see its full breakdown.");

  add("g.status", "How will I know the status of my request?",
    "{{OFFICE}}");

  add("g.claim", "How will I receive my document?",
    "For documents such as the TOR, Copy of Grades and certificates, the Citizen's Charter says you present the request form and official receipt at the Registrar's Office, receive a claim stub, and claim the document on the date written on the stub.");

  add("g.proxy", "Can someone request or claim for me?",
    "{{OFFICE}}");

  add("g.hours", "What are the office hours and where is the office?",
    "{{OFFICE}}");

  /* ==========================================================
     PROBLEMS & TIPS
     ========================================================== */
  add("t.signin", "The form asks me to sign in",
    "Some forms need a Google account to open or submit. Sign in with your Google account and try again.");

  add("t.open", "The form or link won't open",
    "Try these steps:\n1. Check your internet connection.\n2. Refresh the page or try another browser.\n3. Make sure pop-ups are not blocked, because forms open in a new tab.\n4. If it still does not work, tap \"Contact the Registrar\" and tell us which service you were trying to open.");

  add("t.wrong", "I made a mistake in my submission",
    "Whether a response can be edited depends on how the form is set up. Please contact the Registrar and include your full name and the request you submitted so it can be corrected.");

  add("t.noreply", "I haven't heard back about my request",
    "Please check the processing time for your service first (see that service's \"How long does it take?\" or the general processing times).\nIf the usual time has passed, contact the Registrar and include your full name, student number and the request you submitted.");

  add("t.tips", "Tips for a smooth request",
    "- Use your complete name exactly as it appears in your school records.\n- Double-check your student number, program and contact details.\n- Prepare any required documents, documentary stamps and your official receipt before going to the Registrar's Office.\n- Submit only once per request.\n- Keep a screenshot or copy of what you submitted, and keep your receipts and claim stubs.");

  /* ==========================================================
     CONTACT
     ========================================================== */
  add("contact", "Contact the Registrar",
    "Tap the button below to see the contact details.",
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
    ["dropping", "loa", "returning", "other.petition"]);

  add("cat.clearance", "Clearance & eCAV",
    "Which one do you need help with?",
    ["exit", "grad.clearance", "ecav"]);

  add("cat.help", "Problems & tips",
    "Sorry you're having trouble. What's happening?",
    ["t.signin", "t.open", "t.wrong", "t.noreply", "t.tips"]);

  return {
    greeting: "Hi! I'm Reggie, the Registrar's virtual assistant. I can answer common questions about processing your requests, forms and clearances, including their requirements, fees and processing times.\n\nWhat would you like to know?",
    rootPrompt: "What else can I help you with?",
    root: ["cat.general", "cat.enroll", "cat.records", "cat.status", "cat.clearance", "cat.help", "contact"],
    nodes: nodes
  };
})();
