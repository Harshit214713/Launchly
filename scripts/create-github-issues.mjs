// Script to create the 15 audited frontend issues on GitHub repository simplyvardaan/Launchly
import { execSync } from 'child_process';

const REPO = 'simplyvardaan/Launchly';

const ISSUES = [
  {
    title: 'fix(payment): yearly billing & template purchases hardcode INR 1,499 in PaymentModal',
    body: `### Issue Description
In \`src/components/PaymentModal.tsx\`, the function \`getAmountDetails()\` evaluates \`if (price) return { inr: 1499, label: price };\` before checking \`planId\` or \`billingCycle\`.

### Expected Behavior
- Pro Annual subscription ($159/yr) should generate UPI QR code and payment verification for ₹11,999.
- Single Template Source code ($49) should generate UPI QR code and payment verification for ₹3,999.

### Actual Behavior
Both Annual Pro subscriptions and template purchases hardcode the UPI payment amount to ₹1,499.

### File Reference
- \`src/components/PaymentModal.tsx\` (Lines 76-90)`,
    labels: ['bug', 'payments', 'critical']
  },
  {
    title: 'fix(payment): missing manual "I\'ve Paid" verify button in UPI PaymentModal',
    body: `### Issue Description
In \`src/components/PaymentModal.tsx\`, under the UPI Auto-Pay tab, the error state prompts the user to tap "I've Paid", but no manual button exists in the JSX.

### Expected Behavior
Users should be able to tap a manual "I've Paid • Verify & Activate" button if background auto-polling is delayed.

### Actual Behavior
Users are forced to rely solely on automated polling without an interactive fallback button.

### File Reference
- \`src/components/PaymentModal.tsx\` (Lines 430-466)`,
    labels: ['bug', 'payments', 'ux']
  },
  {
    title: 'fix(navigation): live workspace & how it works link to non-existent template "saas-launch"',
    body: `### Issue Description
"Open Studio" in \`LiveWorkspaceSection.tsx\` and Step 2 in \`HowItWorks.tsx\` link to \`/editor/saas-launch\`.
However, \`saas-launch\` does not exist in \`src/lib/templates.ts\`.

### Expected Behavior
Links should direct to a valid SaaS template ID like \`/editor/chronicle-os\` or \`/editor/agenn-ai\`.

### Actual Behavior
The editor silently falls back to \`TEMPLATES[0]\` with an invalid URL slug.

### File Reference
- \`src/components/LiveWorkspaceSection.tsx\` (Line 248)
- \`src/components/HowItWorks.tsx\` (Line 25)`,
    labels: ['bug', 'routing']
  },
  {
    title: 'fix(editor): dark mode text contrast failure on canvas preview navbar',
    body: `### Issue Description
In \`src/app/editor/[templateId]/page.tsx\`, the preview canvas navbar has hardcoded \`bg-white/80\` while applying \`text-ink\`.

### Expected Behavior
The brand title and navbar text should remain legible with high contrast in both light and dark themes.

### Actual Behavior
In dark mode, \`--ink\` is \`#f4f4f8\` (near white), rendering white text on a white navbar.

### File Reference
- \`src/app/editor/[templateId]/page.tsx\` (Lines 1180-1191)`,
    labels: ['bug', 'ui', 'accessibility']
  },
  {
    title: 'fix(editor): inline contentEditable headline and description lose changes on save/export',
    body: `### Issue Description
The canvas hero headline and description have \`contentEditable suppressContentEditableWarning\` but no \`onBlur\` or \`onInput\` event listeners.

### Expected Behavior
Typing directly into the canvas should update React state (\`heroContent\`) so that edits are preserved on Save, Publish, or Export .zip.

### Actual Behavior
Inline canvas edits are never written to state and are completely lost.

### File Reference
- \`src/app/editor/[templateId]/page.tsx\` (Lines 1233-1249)`,
    labels: ['bug', 'editor']
  },
  {
    title: 'fix(editor): undo and redo functionality is completely non-functional',
    body: `### Issue Description
In \`src/app/editor/[templateId]/page.tsx\`, \`history\` is initialized with a static 1-item array and \`setHistory\` is never called when modifications occur.

### Expected Behavior
Undo and Redo buttons and Ctrl+Z / Ctrl+Y keyboard shortcuts should step through previous edit snapshots.

### Actual Behavior
History length remains 1, leaving Undo and Redo permanently disabled/non-functional.

### File Reference
- \`src/app/editor/[templateId]/page.tsx\` (Lines 121, 157-186)`,
    labels: ['bug', 'editor']
  },
  {
    title: 'fix(auth): password length validation mismatch between signup (6 chars) and login (8 chars)',
    body: `### Issue Description
\`src/app/signup/page.tsx\` accepts passwords with 6+ characters, whereas \`src/app/login/page.tsx\` rejects passwords under 8 characters.

### Expected Behavior
Both authentication forms should enforce consistent validation rules.

### Actual Behavior
Users who register with 6- or 7-character passwords are completely locked out of the login screen.

### File Reference
- \`src/app/signup/page.tsx\` (Line 86)
- \`src/app/login/page.tsx\` (Line 91)`,
    labels: ['bug', 'auth']
  },
  {
    title: 'fix(ux): dual navigation and event bubbling in HowItWorks step cards',
    body: `### Issue Description
In \`src/components/HowItWorks.tsx\`, the outer step card \`div\` has an \`onClick\` triggering \`router.push(step.href)\`, while the inner CTA is wrapped in a Next.js \`<Link href={step.href}>\`.

### Expected Behavior
Clicking the card or CTA should trigger a single smooth client-side transition.

### Actual Behavior
Clicking the CTA causes both the Link handler and parent onClick handler to fire, triggering redundant router events.

### File Reference
- \`src/components/HowItWorks.tsx\` (Lines 57-62, 91-98)`,
    labels: ['bug', 'ux']
  },
  {
    title: 'fix(templates): "Preview" button in template list view navigates to editor instead of preview',
    body: `### Issue Description
In \`src/app/templates/TemplatesPageContent.tsx\` list view, both the "Preview" button and "Open in Editor" button navigate to \`/editor/\${template.id}\`.

### Expected Behavior
The "Preview" button should open \`/templates/\${template.id}\` to showcase details, while "Open in Editor" opens \`/editor/\${template.id}\`.

### Actual Behavior
Both buttons open the editor.

### File Reference
- \`src/app/templates/TemplatesPageContent.tsx\` (Lines 352-364)`,
    labels: ['bug', 'routing']
  },
  {
    title: 'fix(a11y): template cards cannot be edited on tablets and touch devices',
    body: `### Issue Description
In \`src/components/TemplateCard.tsx\`, the bottom "Edit" button is hidden with \`md:hidden\`, expecting desktop users to hover.

### Expected Behavior
Tablet and touch laptop users (>= 768px width) should have a visible button to edit templates.

### Actual Behavior
Hover overlays cannot be activated via touch, leaving touch users unable to edit templates from the card.

### File Reference
- \`src/components/TemplateCard.tsx\` (Line 868)`,
    labels: ['bug', 'accessibility', 'mobile']
  },
  {
    title: 'fix(checkout): elapsed second timer displays inaccurate seconds during UPI verification',
    body: `### Issue Description
In \`src/app/checkout/page.tsx\`, \`checkCount\` increments by 1 every 4,000ms, but the status renders \`\${checkCount}s\`.

### Expected Behavior
Status should reflect actual elapsed seconds or poll count.

### Actual Behavior
When 12 seconds elapse, the UI falsely indicates \`(3s)\`.

### File Reference
- \`src/app/checkout/page.tsx\` (Lines 146, 301-302)`,
    labels: ['bug', 'ui']
  },
  {
    title: 'fix(a11y): missing Escape key listeners and body scroll lock across all modal dialogs',
    body: `### Issue Description
None of the modal components (\`PaymentModal\`, \`DeployModal\`, \`SocialShareModal\`) listen for the \`Escape\` keyboard key or lock background body scrolling.

### Expected Behavior
Pressing Escape should dismiss open modals, and background page scrolling should be disabled while dialogs are open.

### Actual Behavior
Escape does not close dialogs, violating WCAG dialog patterns.

### File Reference
- \`src/components/PaymentModal.tsx\`
- \`src/components/DeployModal.tsx\`
- \`src/components/SocialShareModal.tsx\``,
    labels: ['accessibility', 'enhancement']
  },
  {
    title: 'fix(ui): dark mode toggle icon flickers on initial hydration in Navbar',
    body: `### Issue Description
In \`src/components/Navbar.tsx\`, \`isDark\` initializes to \`false\` regardless of \`document.documentElement.classList.contains('dark')\`.

### Expected Behavior
The correct Sun/Moon icon should match the current page theme without an initial flash.

### Actual Behavior
On dark theme page loads, the Moon icon renders first and then visibly switches to the Sun icon after mounting.

### File Reference
- \`src/components/Navbar.tsx\` (Lines 26, 30-33)`,
    labels: ['bug', 'ui']
  },
  {
    title: 'fix(feedback): FeedbackWidget submits mock timeout without forwarding to /api/contact',
    body: `### Issue Description
In \`src/components/FeedbackWidget.tsx\`, submitting feedback sets a 600ms timeout without calling \`/api/contact\`, unlike \`CTA.tsx\`.

### Expected Behavior
Feedback submissions should be saved to the database via \`/api/contact\`.

### Actual Behavior
User feedback is silently discarded.

### File Reference
- \`src/components/FeedbackWidget.tsx\` (Lines 15-25)`,
    labels: ['bug']
  },
  {
    title: 'fix(payment): orderSessionId is static and reused across different checkout attempts in modal',
    body: `### Issue Description
In \`src/components/PaymentModal.tsx\`, \`orderSessionId\` is generated once via \`useState\` initializer. If the modal is opened for Plan A, closed, and reopened for Plan B, the same session ID is reused.

### Expected Behavior
Each checkout session should generate a fresh, unique order reference.

### Actual Behavior
Stale order session IDs create webhook and transaction reconciliation collisions.

### File Reference
- \`src/components/PaymentModal.tsx\` (Lines 52-54)`,
    labels: ['bug', 'payments']
  }
];

async function main() {
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  
  console.log(`Starting GitHub Issues creation for ${REPO}...`);
  
  if (token) {
    console.log('Using GitHub Token for API authentication...');
    for (const [index, issue] of ISSUES.entries()) {
      try {
        const res = await fetch(`https://api.github.com/repos/${REPO}/issues`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.github+json',
            'Content-Type': 'application/json',
            'X-GitHub-Api-Version': '2022-11-28'
          },
          body: JSON.stringify({
            title: issue.title,
            body: issue.body,
            labels: issue.labels
          })
        });

        const data = await res.json();
        if (res.ok) {
          console.log(`[${index + 1}/${ISSUES.length}] Created: #${data.number} - ${issue.title}`);
        } else {
          console.error(`[${index + 1}/${ISSUES.length}] Failed: ${data.message}`);
        }
      } catch (err) {
        console.error(`Error creating issue:`, err);
      }
    }
  } else {
    // Attempt with gh CLI
    console.log('Attempting creation via GitHub CLI (gh)...');
    for (const [index, issue] of ISSUES.entries()) {
      try {
        const labelsArg = issue.labels.map(l => `--label "${l}"`).join(' ');
        const cmd = `gh issue create --repo "${REPO}" --title "${issue.title.replace(/"/g, '\\"')}" --body "${issue.body.replace(/"/g, '\\"')}" ${labelsArg}`;
        const output = execSync(cmd, { encoding: 'utf8' });
        console.log(`[${index + 1}/${ISSUES.length}] Created: ${output.trim()}`);
      } catch (err) {
        console.error(`[${index + 1}/${ISSUES.length}] Failed via gh CLI:`, err.message);
      }
    }
  }
}

main();
