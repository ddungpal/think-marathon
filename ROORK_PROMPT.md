# Rork Prompt: 진단 결과 페이지 재현

## Objective
Recreate the UI shown in the provided image as closely as possible, matching layout, spacing, typography, colors, component shapes, and overall visual hierarchy exactly. This is not inspiration—follow the image precisely.

## Technical Requirements

### Architecture
- Use strict Object-Oriented Programming (OOP) principles
- Break the UI into clean, reusable components
- Create a single global theme file for all:
  - Colors
  - Fonts
  - Spacing
  - Corner radius
  - Shadows
- **NO hardcoded styles inside components**—all styles must reference the theme

### Functionality
- Fully functional app with proper navigation
- State handling and interactions that reflect the design intent
- If any assets are missing (icons, images, avatars, illustrations, backgrounds), generate them automatically in a style that perfectly matches the provided design

### Code Quality
- Prioritize clean architecture
- Maintainability
- Performance
- **Do not introduce new UI elements or redesign anything**—follow the image precisely

## Design Specifications from Image

### Layout Structure
1. **Main Container**
   - White card with subtly rounded corners floating on light gray/off-white background
   - Faint shadow beneath the card for elevation
   - Vertical, linear layout guiding from top to bottom
   - Ample white space throughout

2. **Section 1: 결과 해설 (Result Interpretation)**
   - **Title:** "결과 해설" 
     - Large, bold black sans-serif font
     - Prominently displayed at the top
   - **Content:** Four paragraphs of Korean text
     - Standard black font
     - Key phrases bolded for emphasis (e.g., "거의 없이", "애정은 남아 있지만", "스스로의 스트레스")
     - Paragraphs separated by line breaks
   - **Separator:** Thin, light gray horizontal line after section

3. **Section 2: 나를 위한 조언 (Advice for Me)**
   - **Title:** "나를 위한 조언"
     - Same large, bold black font as Section 1
     - Positioned below first separator
   - **Content:** Two paragraphs of Korean text
     - Standard black font
     - Key phrases bolded (e.g., "아슬아슬한 상태", "오래 사랑하기 위한 선택")
   - **Separator:** Thin, light gray horizontal line after section

4. **Section 3: 삶 클리닉의 심리 처방 (Life Clinic's Psychological Prescription)**
   - **Title:** "삶 클리닉의 심리 처방"
     - Same large, bold black font as previous sections
     - Positioned at bottom
   - **Content:** Two bullet points
     - Each preceded by small, solid green circle with white checkmark icon
     - Text in standard black font

### Color Palette
- **Background:** Very light gray/off-white (#F7F8FA or similar)
- **Card Background:** Pure white (#FFFFFF)
- **Text:** Black (#191F28 or #000000 for body text)
- **Headings:** Bold black (same as text but bold)
- **Separator Lines:** Light gray (#E5E8EB or similar)
- **Accent Color:** Vibrant green for checkmark icons (#10B981 or similar vibrant green)

### Typography
- **Font Family:** Clean, legible sans-serif (e.g., system font stack: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif)
- **Headings:** Large, bold, black
- **Body Text:** Standard weight, black
- **Bolded Keywords:** Same font family, bold weight

### Spacing
- Generous white space between sections
- Consistent padding inside the card
- Clear separation between title and content
- Adequate spacing between paragraphs
- Spacing between bullet points

### Component Specifications

#### Main Card Component
- White background
- Subtly rounded corners (approximately 12-16px radius)
- Faint shadow for elevation (subtle, soft shadow)
- Maximum width constraint (centered on larger screens)
- Padding around content

#### Section Component
- Title with large, bold typography
- Content area with paragraphs or bullet points
- Separator line (thin, light gray) after each section (except last)

#### Text Component
- Support for regular and bold text
- Proper line height for readability
- Paragraph spacing

#### Bullet Point Component
- Green circle with white checkmark icon
- Text aligned next to icon
- Consistent spacing between icon and text

### Exact Content to Display

**Section 1: 결과 해설**
- Paragraph 1: "번아웃 증상이 **거의 없이** 일에 몰입할 수 있는 상태입니다."
- Paragraph 2: "피로가 누적되어, 집중력 저하나 무기력, 짜증과 같은 다른 증상들이 나타나고 있을 가능성이 있어요."
- Paragraph 3: "일에 대한 **애정은 남아 있지만**, 업무 밖에서 나의 에너지가 충분히 회복되지 않는 것 같아요."
- Paragraph 4: "하루를 보내는 것이 버겁게 느껴지고, 감정적인 여유도 줄어들어 있어 **스스로의 스트레스**가 높을 거예요."

**Section 2: 나를 위한 조언**
- Paragraph 1: "일에 대한 책임감이 나를 이끌고 있지만, 균형이 쉽게 무너질 수 있는 **아슬아슬한 상태**임을 알아주세요."
- Paragraph 2: "지금 일에 대한 애정을 조금 내려놓는 것이 나의 일을 더 **오래 사랑하기 위한 선택**일 수 있습니다."

**Section 3: 삶 클리닉의 심리 처방**
- Bullet 1: "현재 에너지를 가장 소모시키는 행동/사람 선별해 거리 두기"
- Bullet 2: "일과 후, 에너지를 회복시킬 수 있는 여가활동을 찾아 하루 30분 꼭 챙기기"

## Implementation Guidelines

1. **Theme File Structure:**
   ```javascript
   // theme.js
   export const theme = {
     colors: {
       background: '#F7F8FA',
       cardBackground: '#FFFFFF',
       text: '#191F28',
       textBold: '#000000',
       separator: '#E5E8EB',
       accent: '#10B981',
     },
     fonts: {
       family: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
       heading: {
         size: '24px', // Adjust to match image
         weight: 'bold',
       },
       body: {
         size: '16px', // Adjust to match image
         weight: 'normal',
       },
     },
     spacing: {
       section: '32px', // Adjust to match image
       paragraph: '16px',
       cardPadding: '24px',
     },
     borderRadius: {
       card: '12px',
       icon: '50%',
     },
     shadows: {
       card: '0 2px 8px rgba(0, 0, 0, 0.08)', // Subtle shadow
     },
   };
   ```

2. **Component Hierarchy:**
   - `DiagnosisResultPage` (main container)
     - `ResultCard` (white card with shadow)
       - `ResultSection` (reusable for each section)
         - `SectionTitle`
         - `SectionContent` (paragraphs or bullet points)
         - `SectionSeparator`
       - `BulletPoint` (for prescription items)
         - `CheckmarkIcon` (green circle with white checkmark)

3. **Key Components:**

   **ResultCard:**
   - Uses theme.colors.cardBackground
   - Uses theme.borderRadius.card
   - Uses theme.shadows.card
   - Uses theme.spacing.cardPadding

   **SectionTitle:**
   - Uses theme.fonts.heading
   - Uses theme.colors.textBold
   - Margin bottom from theme.spacing

   **SectionContent:**
   - Uses theme.fonts.body
   - Uses theme.colors.text
   - Paragraph spacing from theme.spacing.paragraph

   **BulletPoint:**
   - Green circle from theme.colors.accent
   - White checkmark icon
   - Text aligned with icon

4. **Responsive Behavior:**
   - Card should be centered on larger screens
   - Maintain proportions and spacing across screen sizes
   - Maximum width constraint for readability

## Critical Notes

- **DO NOT** add any UI elements not shown in the image
- **DO NOT** change the layout structure
- **DO NOT** modify colors, fonts, or spacing beyond matching the image
- **DO NOT** add animations or transitions unless they match the image (the image shows a static design)
- **DO** match the exact visual hierarchy and spacing
- **DO** use the theme file for all styling values
- **DO** create clean, reusable components
- **DO** ensure all text content matches exactly (including bolded phrases)

## Deliverables

1. Complete theme configuration file
2. All component files following OOP principles
3. Main page/container component
4. Fully functional application with proper state management
5. Any generated assets (icons, illustrations) matching the design style

