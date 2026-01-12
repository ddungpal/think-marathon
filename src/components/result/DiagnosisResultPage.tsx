'use client';

import React from 'react';
import { diagnosisResultTheme } from '@/theme/diagnosis-result-theme';
import { ResultCard } from './ResultCard';
import { DiagnosisSection } from './DiagnosisSection';
import { SectionSeparator } from './SectionSeparator';
import { ParagraphText } from './ParagraphText';
import { PrescriptionItem } from './PrescriptionItem';

/**
 * DiagnosisResultPage Component
 * Main component rendering the diagnosis result UI.
 * Follows the exact design from the provided image with three sections.
 * Uses OOP principles - all components reference theme values only.
 */
export class DiagnosisResultPage extends React.Component {
  private theme = diagnosisResultTheme;

  render() {
    const { colors } = this.theme;

    const pageStyle: React.CSSProperties = {
      backgroundColor: colors.pageBackground,
      minHeight: '100vh',
      padding: '20px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      paddingTop: '40px',
    };

    const containerStyle: React.CSSProperties = {
      maxWidth: '600px',
      width: '100%',
    };

    return (
      <div style={pageStyle}>
        <div style={containerStyle}>
          <ResultCard>
            {/* Section 1: 결과 해설 */}
            <DiagnosisSection title="결과 해설" isFirst>
              <ParagraphText content="번아웃 증상이 **거의 없이** 일에 몰입할 수 있는 상태입니다." />
              <ParagraphText content="피로가 누적되어, 집중력 저하나 무기력, 짜증과 같은 다른 증상들이 나타나고 있을 가능성이 있어요." />
              <ParagraphText content="일에 대한 **애정은 남아 있지만**, 업무 밖에서 나의 에너지가 충분히 회복되지 않는 것 같아요." />
              <ParagraphText content="하루를 보내는 것이 버겁게 느껴지고, 감정적인 여유도 줄어들어 있어 **스스로의 스트레스**가 높을 거예요." isLast />
            </DiagnosisSection>

            <SectionSeparator />

            {/* Section 2: 나를 위한 조언 */}
            <DiagnosisSection title="나를 위한 조언">
              <ParagraphText content="일에 대한 책임감이 나를 이끌고 있지만, 균형이 쉽게 무너질 수 있는 **아슬아슬한 상태**임을 알아주세요." />
              <ParagraphText content="지금 일에 대한 애정을 조금 내려놓는 것이 나의 일을 더 **오래 사랑하기 위한 선택**일 수 있습니다." isLast />
            </DiagnosisSection>

            <SectionSeparator />

            {/* Section 3: 삶 클리닉의 심리 처방 */}
            <DiagnosisSection title="삶 클리닉의 심리 처방">
              <PrescriptionItem text="현재 에너지를 가장 소모시키는 행동/사람 선별해 거리 두기" />
              <PrescriptionItem text="일과 후, 에너지를 회복시킬 수 있는 여가활동을 찾아 하루 30분 꼭 챙기기" isLast />
            </DiagnosisSection>
          </ResultCard>
        </div>
      </div>
    );
  }
}

