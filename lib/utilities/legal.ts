export function buildPrivacyPolicy(input: {
  company: string;
  website: string;
  effective: string;
}): string {
  const company = input.company.trim() || "[Company name]";
  const website = input.website.trim() || "[Website URL]";
  const effective = input.effective.trim() || "[Effective date]";
  return `Privacy Policy (Starter)

Effective date: ${effective}
Organization: ${company}
Website: ${website}

This starter document describes, in plain language, how ${company} might collect, use, and store information on ${website}. It is a drafting aid, not legal advice, and it is not a substitute for counsel in your jurisdiction.

1. Information you provide
We may collect information you type into forms, accounts, or support messages, such as a name, email address, or project details.

2. Information created in use
Pages may collect technical data such as browser type, approximate location derived from IP address, and pages visited. The exact set depends on the services you enable.

3. How information is used
Typical uses include operating the website, answering requests, improving reliability, and meeting legal duties.

4. Sharing
Do not assume information stays inside ${company}. List every analytics, hosting, payment, or support vendor you actually use before publishing this policy.

5. Retention
Describe how long each category of data is kept and how deletion requests are handled.

6. Choices
Explain how a person can access, correct, or delete information, and how to opt out of marketing.

7. Children
State whether the service is directed to children and what you do if you learn a child’s data was collected.

8. Contact for privacy questions
Add a privacy contact method only if you are prepared to monitor it. This starter does not include a public email address.

Replace every placeholder and have a qualified professional review the finished policy before you publish it.`;
}

export function buildTerms(input: {
  company: string;
  website: string;
  effective: string;
}): string {
  const company = input.company.trim() || "[Company name]";
  const website = input.website.trim() || "[Website URL]";
  const effective = input.effective.trim() || "[Effective date]";
  return `Terms of Use (Starter)

Effective date: ${effective}
Organization: ${company}
Website: ${website}

These starter terms outline a possible agreement between ${company} and visitors of ${website}. They are a drafting aid, not legal advice.

1. The service
Describe what ${website} provides and what it does not provide. Do not promise outcomes you cannot deliver.

2. Accounts
If accounts exist, explain eligibility, password responsibility, and when access may be suspended.

3. Acceptable use
Prohibit illegal activity, abuse of other users, and attempts to disrupt the service.

4. Content
State who owns user content, what license ${company} needs to operate the product, and how takedown requests are handled.

5. Disclaimers
Utilities, estimates, and generated text can be incomplete. Users should verify results before relying on them.

6. Limitation of liability
Have counsel draft limits that are enforceable where you operate. Do not copy this paragraph into production unchanged.

7. Changes
Explain how ${company} will announce updates to these terms.

8. Governing law
Name the jurisdiction that actually applies to your organization.

Review this document with a qualified professional before publishing.`;
}
