import { Box, FormControl, FormLabel } from '@chakra-ui/react';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import RemarkMathPlugin from 'remark-math';
import MdEditor from '../../Editor/MdEditor';
import InfoButton from '../../UtilityComponents/InfoButton';

import 'katex/dist/katex.min.css';
import 'react-markdown-editor-lite/lib/index.css';

type MarkDownFieldProps = {
  label: string;
  value: string;
  setValue: (value: string) => void;
  infoTitle?: string;
  infoDescription?: string;
  infoPlacement?: 'top' | 'right' | 'bottom' | 'left';
};

const MarkDownField = ({
  label,
  value,
  setValue,
  infoTitle,
  infoDescription,
  infoPlacement = 'right',
}: MarkDownFieldProps) => {
  return (
    <Box
      p={2}
      border="solid"
      borderColor="grey"
      borderRadius="8px"
      borderWidth="1px"
    >
      <FormControl>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <FormLabel m={0}>{label}</FormLabel>
          {infoTitle && infoDescription && (
            <InfoButton
              title={infoTitle}
              description={infoDescription}
              placement={infoPlacement}
            />
          )}
        </Box>
        <MdEditor
          style={{
            height: '250px',
            width: '100%',
          }}
          config={{
            view: {
              menu: true,
              md: true,
              html: false,
            },
            containerStyle: {
              width: '100%',
            },
          }}
          value={value}
          onChange={({ text }) => setValue(text)}
          renderHTML={(text) => (
            <ReactMarkdown
              remarkPlugins={[remarkGfm, RemarkMathPlugin]}
              rehypePlugins={[rehypeKatex, rehypeRaw]}
            >
              {text}
            </ReactMarkdown>
          )}
        />
      </FormControl>
    </Box>
  );
};

export default MarkDownField;
