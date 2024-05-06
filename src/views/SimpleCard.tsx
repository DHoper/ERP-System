import { Card, Box} from '@mui/material';
import { styled } from '@mui/material/styles';

const CardRoot = styled(Card)({
  height: '100%',
  padding: '20px 24px'
});

// const CardTitle = styled('div')(({ subtitle }) => ({
//   fontSize: '1rem',
//   fontWeight: '500',
//   textTransform: 'capitalize',
//   marginBottom: !subtitle && '16px'
// }));

const SimpleCard = ({children}) => {
  return (
    <CardRoot elevation={6} sx={{padding: "2rem 2rem 1rem 2rem"}}>
      {/* <CardTitle subtitle={subtitle}>{title}</CardTitle> */}
      {/* {subtitle && <Box sx={{ mb: 2 }}>{subtitle}</Box>} */}
      {children}
    </CardRoot>
  );
};

export default SimpleCard;
