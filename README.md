# Mental Tabs - Product Requirements Document

## 1. Product Overview

**Product Name:** Mental Tabs  
**Target Users:** Founders & Business Owners  
**Core Problem:** Context-switching kills flow state when capturing tasks from emails, messages, and feedback across multiple platforms.

### Value Proposition
Stop breaking your flow. Apply a Gmail label, use a Slack command, or text WhatsApp—your tasks instantly appear in Notion. Zero app-switching. Zero manual entry.

### Key Differentiators
1. **Zero Context Switching** - Capture without leaving your current tool
2. **Native Integration** - Works within existing workflows (Gmail labels, Slack commands)
3. **Privacy-First** - We never store your messages, only OAuth tokens
4. **Universal Capture** - One Notion database for all input sources

---

## 2. How It Works

### Gmail Integration
**User Flow:** Apply label "mentaltabs" to any email → Item appears in Notion with backlink

**Implementation:**
- Gmail API with OAuth 2.0
- Watch for "mentaltabs" label via Push Notifications
- Extract subject, body, sender, timestamp
- Generate permalink back to original email
- Store refresh token in MongoDB

### Slack Integration
**User Flow:** Type `/mentaltabs [task description]` → Confirmation → Item in Notion

**Implementation:**
- Slack App with slash command
- Capture text, channel context, timestamp
- Generate Slack permalink
- Store bot token in MongoDB

### WhatsApp Integration
**User Flow:** Text dedicated number → Confirmation → Item in Notion

**Implementation:**
- Twilio WhatsApp Business API
- Support text, voice notes (transcription), images (OCR)
- Store Twilio credentials in MongoDB

### Google Sheets Integration
**User Flow:** Mark rows in Sheet → Bulk sync to Notion

**Implementation:**
- Google Sheets API with OAuth 2.0
- Watch specific sheets or trigger column
- Batch process marked rows

### OCR & Raw Text
**User Flow:** Upload screenshot/whiteboard photo → AI extracts → Items in Notion

**Implementation:**
- Web upload interface (Lovable frontend)
- OCR via Tesseract or Google Vision API
- AI breaks down into individual tasks

### Future Integrations
- **iMessage** (Q2 2026): MCP for Mac, iOS Shortcuts
- **Apple Notes** (Q3 2026): CloudKit API with tag watching

---

## 3. AI-Powered Categorization

**AI processes each input to populate:**

| Column | AI Task | Example |
|--------|---------|---------|
| Title | Extract main action | "Follow up with investor John" |
| Status | Default to "Open" | Open |
| Type | Task/Idea/Thought/Question/Reminder/Decision | Task |
| Priority | Detect urgency keywords | High |
| Date Created | Auto-timestamp | 2026-01-19 |
| Due Date | Parse natural language | "tomorrow" → 2026-01-20 |
| Notes | Full content + backlink | Email from john@vc.com + link |
| Source | Log origin | Gmail |
| Tags | Extract keywords | #investor, #follow-up |

**AI Stack:** OpenAI GPT-4 or Anthropic Claude Sonnet

---

## 4. Notion Integration

**Setup:**
- OAuth 2.0 connection during onboarding
- Auto-create "Mental Tabs" database in user's workspace
- Store database ID in MongoDB
- Real-time sync (<10 seconds)

**Data Stored in MongoDB:**
```json
{
  "user_id": "uuid",
  "gmail_refresh_token": "encrypted",
  "slack_access_token": "encrypted",
  "notion_access_token": "encrypted",
  "notion_database_id": "string",
  "whatsapp_number": "encrypted"
}
```

**Privacy:** No messages stored—only OAuth tokens and Notion metadata

---

## 5. Onboarding Flow

1. **Sign Up** - Email or Google OAuth
2. **Connect Notion** - Auto-creates Mental Tabs database
3. **Choose Channels** - Select Gmail, Slack, WhatsApp, Sheets (at least one)
4. **Test Capture** - Send first item, see it appear in Notion
5. **Done** - Back to work

**Goal:** <3 minutes, 75%+ completion rate

---

## 6. Technical Stack

**Frontend:** Lovable (no-code/low-code platform)  
**Backend:** Node.js, Express  
**Database:** MongoDB Atlas (OAuth tokens only)  
**AI:** OpenAI GPT-4 or Claude Sonnet  
**Queue:** Bull + Redis (retry logic)  
**Hosting:** Railway or Vercel (backend)

**Data Flow:**
```
Input (Gmail/Slack/WhatsApp/Sheets) 
  → Webhook 
  → Queue (Redis) 
  → AI Processing 
  → Notion API 
  → Confirmation
```

---

## 7. Success Metrics

**Launch Goals (30 Days):**
- 200 beta users
- 75% 30-day retention
- 8+ captures per user per day
- <2% sync failure rate

**Key Metrics:**
- Daily active users
- Captures per user per day
- Channel usage breakdown
- Time from capture to Notion sync

---

## 8. Launch Plan

1. **Private Beta** - 50 founders from network (Week 1-2)
2. **Iterate** - Fix bugs, improve AI accuracy (Week 3-4)
3. **Product Hunt** - Target #1 Product of the Day (Month 2)
4. **Content** - "How I save 2 hours/day eliminating context-switching"

---

## 9. Pricing (Post-MVP)

**Free:** 100 captures/month, 2 integrations  
**Pro ($12/mo):** Unlimited captures, all integrations, advanced AI  
**Team ($30/mo):** 5 users, shared database, team insights

---

## 10. Roadmap

**Q2 2026:** iMessage, voice call capture, Chrome extension  
**Q3 2026:** Apple Notes, smart reminders, weekly summaries  
**Q4 2026:** Mobile app, collaboration features, API

---

## 11. Key Risks

| Risk | Mitigation |
|------|------------|
| API rate limits | Queue system, request batching |
| AI errors | User feedback loop, manual override |
| Token expiration | Proactive refresh management |
| Privacy concerns | "We never store messages" messaging |

---
