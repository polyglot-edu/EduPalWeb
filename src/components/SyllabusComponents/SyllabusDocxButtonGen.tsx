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
          ['Academic Year', academicYear],
          ['Degree Program', courseOfStudy], // e.g., "F3I - Computer Science"
          ['Study Regulation', studyRegulation], // Not provided
          ['Curriculum Path', curriculumPath], // Not provided
          ['Course / Module', `${courseCode} - ${title}`], // e.g., "F1081 - Mobile App Dev"
          ['Integrated Course Unit', integratedCourseUnit], // Not provided
          ['Student Partition', studentPartition], // Not provided
          ['Semester ', semester], // e.g., "S2 - Second Semester"
          ['Location', department], // Not provided
          ['Course Year', courseYear], // missing
          ['Scientific Sector', disciplinarySector], // e.g., "INF/01 - Computer Science"
          ['Course Type', courseType], // missing
          ['Subject Area', subjectArea], //missing
          ['Credits (CFU)', credits?.toString()],
          ['Contact Hours', teachingHours?.toString()],
          ['AF_ID', ''], // Provided
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

    const buildTextInfoTable = () =>
      new Table({
        layout: TableLayoutType.FIXED,
        width: { size: 100, type: WidthType.PERCENTAGE },
        columnWidths: [1800, 1800, 1800, 1800, 7200], // in twips (~12.5%, 50%)
        rows: [
          ['Text Type', 'Code Type', 'Max Char.', 'Required', 'Value'],
          [
            'Language of Instruction',
            'LINGUA_INS',
            null,
            language ? 'Yes' : 'No',
            language,
          ],
          [
            'Objectives',
            'OBIETT_FORM',
            null,
            goalsString ? 'Yes' : 'No',
            goalsString || 'N/D',
          ],
          [
            'Prerequisites',
            'PREREQ',
            null,
            prereqString ? 'Yes' : 'No',
            prereqString || 'N/D',
          ],
          [
            'Contents',
            'CONTENUTI',
            null,
            description ? 'Yes' : 'No',
            description,
          ],
          [
            'Teaching Methods',
            'METODI_DID',
            null,
            teachingMethodsString ? 'Yes' : 'No',
            teachingMethodsString || 'N/D',
          ],
          [
            'Assessment Methods',
            'MOD_VER_APPR',
            null,
            assessmentMethodsString ? 'Yes' : 'No',
            assessmentMethodsString || 'N/D',
          ],
          [
            'Reference Texts',
            'TESTI_RIF',
            null,
            referenceMaterialsString ? 'Yes' : 'No',
            referenceMaterialsString || 'N/D',
          ],
          [
            'Additional Information',
            'ALTRO',
            null,
            additional_information ? 'Yes' : 'No',
            additional_information,
          ],
        ].map(
          ([type, codeType, maxChar, required, value], rowIndex) =>
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
                ...[codeType, maxChar, required, value].map(
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
                  text: 'Educational Activity Syllabus',
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
    <Button float="right" onClick={generateDocx} colorScheme="blue" size="md">
      Download Syllabus (Word)
    </Button>
  );
};

export default SyllabusDocxButton;
