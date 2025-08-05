import { Button } from '@chakra-ui/react';
import {
  AlignmentType,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableLayoutType,
  TableRow,
  TextRun,
  WidthType,
} from 'docx';
import { saveAs } from 'file-saver';
import React from 'react';
import { PolyglotSyllabus } from '../../types/polyglotElements';

type Props = {
  syllabus: PolyglotSyllabus;
};

//modifica topic per selezione multipla MANCAAAAAAAAAAAAAAAAAAA

const SyllabusDocxButton: React.FC<Props> = ({ syllabus }) => {
  const generateDocx = async () => {
    const {
      academicYear,
      subjectArea,
      courseCode,
      courseOfStudy,
      title,
      description,
      language,
      goals,
      prerequisites,
      topics,
      credits,
      semester,
      author,
      teachingHours,
      disciplinarySector,
      teachingMethods,
      assessmentMethods,
      referenceMaterials,
      additional_information,
      courseYear,
      studyRegulation,
      curriculumPath,
      studentPartition,
      integratedCourseUnit,
      courseType,
      department,
    } = syllabus;

    const goalsString = goals.join(' - ') || undefined;
    const prereqString = prerequisites.join(' - ') || undefined;
    const teachingMethodsString = teachingMethods.join(' - ') || undefined;
    const assessmentMethodsString = assessmentMethods.join(' - ') || undefined;
    const referenceMaterialsString =
      referenceMaterials.join(' - ') || undefined;

    const buildInfoTable = () =>
      new Table({
        layout: TableLayoutType.FIXED,
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          ['Anno Offerta', academicYear],
          ['Corso di Studio', courseOfStudy],
          ['Regolamento Didattico', studyRegulation],
          ['Percorso di Studio', curriculumPath],
          ['Insegnamento/Modulo', `${courseCode} - ${title}`],
          ['Attività Formativa Integrata', integratedCourseUnit],
          ['Partizione Studenti', studentPartition],
          ['Periodo Didattico', semester],
          ['Sede', department],
          ['Anno Corso', courseYear],
          ['Settore', disciplinarySector],
          ['Tipo attività Formativa', courseType],
          ['Ambito', subjectArea],
          ['CFU', credits?.toString()],
          ['Ore Attività Frontali', teachingHours?.toString()],
          ['AF_ID', ''],
        ].map(
          ([label, value]) =>
            new TableRow({
              children: [
                new TableCell({
                  shading: { fill: 'F2F2F2' },
                  width: { size: 30, type: WidthType.PERCENTAGE },
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: label,
                          bold: true,
                          font: 'Arial',
                          size: 22, // 11pt
                        }),
                      ],
                    }),
                  ],
                }),
                new TableCell({
                  width: { size: 70, type: WidthType.PERCENTAGE },
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: value || '',
                          font: 'Arial',
                          size: 22, // 11pt
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            })
        ),
      });

    const buildTextInfoTable = () => {
      const content = topics
        .map((topic) => `${topic.macro_topic}:\n${topic.details}`)
        .join('\n\n');

      const objectives = topics
        .map((topic) => {
          const { knowledge, skills, attitude } =
            topic.learning_objectives || {};
          return [knowledge, skills, attitude].filter(Boolean).join(' ');
        })
        .filter(Boolean)
        .join('\n\n');

      return new Table({
        layout: TableLayoutType.FIXED,
        width: { size: 100, type: WidthType.PERCENTAGE },
        columnWidths: [
          1600,
          1600,
          1600,
          1600,
          language == 'italian' ? 7000 : 1600,
          language == 'english' ? 7000 : 1600,
        ], // in twips (~12.5%, 50%)
        rows: [
          [
            'Tipo Testo',
            'Codice Tipo Testo',
            'Num. Max. Caratteri',
            'Obbl.',
            'Testo in Italiano',
            'Testo in Inglese',
          ],
          [
            'Lingua insegnamento',
            'LINGUA_INS',
            null,
            language ? 'Sì' : 'No',
            language == 'italian' ? language : '',
            language == 'english' ? language : '',
          ],
          [
            'Obiettivi',
            'OBIETT_FORM',
            null,
            goalsString ? 'Sì' : 'No',
            language == 'italian' ? objectives || 'N/D' : '',
            language == 'english' ? objectives || 'N/D' : '',
          ],
          [
            'Prerequisiti',
            'PREREQ',
            null,
            prereqString ? 'Sì' : 'No',
            language == 'italian' ? prereqString || 'N/D' : '',
            language == 'english' ? prereqString || 'N/D' : '',
          ],
          [
            'Contenuti',
            'CONTENUTI',
            null,
            description ? 'Sì' : 'No',
            language == 'italian' ? content : '',
            language == 'english' ? content : '',
          ],
          [
            'Metodi didattici',
            'METODI_DID',
            null,
            teachingMethodsString ? 'Sì' : 'No',
            language == 'italian' ? teachingMethodsString || 'N/D' : '',
            language == 'english' ? teachingMethodsString || 'N/D' : '',
          ],
          [
            "Verifica dell'apprendimento",
            'MOD_VER_APPR',
            null,
            assessmentMethodsString ? 'Sì' : 'No',
            language == 'italian' ? assessmentMethodsString || 'N/D' : '',
            language == 'english' ? assessmentMethodsString || 'N/D' : '',
          ],
          [
            'Testi',
            'TESTI_RIF',
            null,
            referenceMaterialsString ? 'Sì' : 'No',
            language == 'italian' ? referenceMaterialsString || 'N/D' : '',
            language == 'english' ? referenceMaterialsString || 'N/D' : '',
          ],
          [
            'Obiettivi Agenda 2030 per lo sviluppo sostenibile',
            'OB_SVIL_SOS',
            null,
            'Sì',
            null,
            null,
          ],
          [
            'Additional Information',
            'ALTRO',
            null,
            additional_information ? 'Sì' : 'No',
            language == 'italian' ? additional_information : '',
            language == 'english' ? additional_information : '',
          ],
          ['NON COMPILARE!', 'PROGR_EST', '1', 'No', null, null],
        ].map(
          ([type, codeType, maxChar, required, valueIt, valueEn], rowIndex) =>
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 1800, type: WidthType.DXA },
                  shading: { fill: 'F2F2F2' },
                  children: [
                    new Paragraph({
                      children: [new TextRun({ text: type || '', bold: true })],
                    }),
                  ],
                }),
                ...[codeType, maxChar, required, valueIt, valueEn].map(
                  (cellValue, colIndex) =>
                    new TableCell({
                      width: {
                        size: colIndex === 3 ? 7200 : 1800,
                        type: WidthType.DXA,
                      },
                      shading: rowIndex === 0 ? { fill: 'F2F2F2' } : undefined,
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: cellValue || '',
                              bold: rowIndex === 0,
                            }),
                          ],
                        }),
                      ],
                    })
                ),
              ],
            })
        ),
      });
    };

    const doc = new Document({
      styles: {
        default: {
          document: {
            run: {
              font: 'Arial',
              size: 22,
            },
            paragraph: {
              spacing: { line: 276 },
            },
          },
        },
      },
      sections: [
        {
          properties: {
            page: {
              margin: { top: 720, bottom: 720, left: 1080, right: 1080 },
            },
          },
          children: [
            new Paragraph({
              heading: HeadingLevel.TITLE,
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 },
              children: [
                new TextRun({
                  text: 'Syllabus Attività Formativa',
                  font: 'Aptos Display (Titoli)',
                  size: 40,
                  bold: true,
                  color: '0F4761',
                }),
              ],
            }),

            buildInfoTable(),

            new Paragraph({ spacing: { after: 400 } }),

            buildTextInfoTable(),

            new Paragraph({
              text: 'Document generated with EduPalWeb.',
              alignment: AlignmentType.CENTER,
              spacing: { before: 500 },
            }),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `syllabus_${title.replace(/ /g, '_')}.docx`);
  };

  return (
    <Button float="right" onClick={generateDocx} colorScheme="purple" size="sm">
      Download (docx)
    </Button>
  );
};

export default SyllabusDocxButton;
