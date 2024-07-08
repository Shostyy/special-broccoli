import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, IconButton, Table, TableBody, TableCell, TableRow, TableHead, Typography, Paper, Box } from '@mui/material';
import { format } from 'date-fns';
import CloseIcon from '@mui/icons-material/Close';
import { OrderData } from '../../../../../api/types/orderData';
import CheckIcon from '@mui/icons-material/Check';

interface OrderDetailsDialogProps {
    order: OrderData | null;
    onClose: () => void;
}

const statusColor: { [key: string]: string } = {
    DRAFT: '#FFFFFF',
    ACCEPTED: '#7BD0E5',
    DELIVERY: '#98783B',
    DONE: '#3C3E6B'
};

const OrderDetailsDialog: React.FC<OrderDetailsDialogProps> = ({ order, onClose }) => {
    const { t } = useTranslation();

    if (!order) return null;

    const statusSteps = ['DRAFT', 'ACCEPTED', 'DELIVERY', 'DONE'];
    const colors = ['#FFFFFF', '#7BD0E5', '#98783B', '#3C3E6B'];
    const currentStatusIndex = statusSteps.indexOf(order.status);

    const getStatusColor = (index: number) => {
        if (index < currentStatusIndex) return '#c25458';
        if (index === currentStatusIndex) return '#c25458';
        return 'grey.300';
    };

    const progressWidth = currentStatusIndex * 33.33;

    return (
        <Dialog open={!!order} onClose={onClose} maxWidth="lg" fullWidth>
            <DialogContent>
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>

                <Box sx={{ mb: 3 }}>
                    <Paper
                        elevation={1}
                        sx={{
                            p: 2,
                            px: 2,
                            borderRadius: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            maxWidth: 'fit-content'
                        }}
                    >
                        <Typography variant="body2" sx={{ mr: 2 }}>
                            {t('StatusOfOrder')}:
                        </Typography>
                        <Box
                            sx={{
                                width: 10,
                                height: 10,
                                borderRadius: '50%',
                                bgcolor: statusColor[order.status],
                                mr: 1
                            }}
                        />
                        <Typography variant="body2" sx={{ mr: 2 }}>
                            {t(order.status)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {format(order.dateCreated, 'dd-MM-yyyy HH:mm:ss')}
                        </Typography>
                    </Paper>
                </Box>

                <Box sx={{ mb: 3, bgcolor: '#f9f9f9', padding: '120px', paddingInline: '50px' }} minHeight={200}>
                    <Box position="relative" height={2} bgcolor="grey.300" mx={4}>
                        <Box
                            position="absolute"
                            left={0}
                            top={0}
                            height="100%"
                            width={`${progressWidth}%`}
                            bgcolor="#c25458"
                        />
                        {statusSteps.map((status, index) => {
                            const colors = ['#FFFFFF', '#7BD0E5', '#98783B', '#3C3E6B'];
                            return (
                                <Box
                                    key={index}
                                    position="absolute"
                                    left={`${index * 33.33}%`}
                                    top={-30}
                                    sx={{
                                        transform: 'translateX(-50%)',
                                    }}
                                >
                                    <Box
                                        width={60}
                                        height={60}
                                        borderRadius="50%"
                                        bgcolor={index <= currentStatusIndex ? colors[index] : 'grey.300'}
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                    >
                                        {index === statusSteps.length - 1 && currentStatusIndex === statusSteps.length - 1 && (
                                            <CheckIcon style={{ color: 'white' }} />
                                        )}
                                        <Typography
                                            sx={{
                                                position: 'absolute',
                                                top: -30,
                                                left: '50%',
                                                transform: 'translateX(-50%)',
                                                width: 'max-content',
                                                textAlign: 'center',
                                            }}
                                        >
                                            {t(status)}
                                        </Typography>
                                        {index === currentStatusIndex && (
                                            <Typography
                                                sx={{
                                                    position: 'absolute',
                                                    top: 70,
                                                    left: '50%',
                                                    transform: 'translateX(-50%)',
                                                    width: 'max-content',
                                                    textAlign: 'center',
                                                    fontSize: '12px',
                                                    color: '#808080'
                                                }}
                                            >
                                                {format(order.dateCreated, 'dd-MM-yyyy HH:mm:ss')}
                                            </Typography>
                                        )}

                                    </Box>
                                </Box>
                            );
                        })}
                    </Box>
                </Box>

                {order.items.length > 0 && (
                    <Typography variant="h6" gutterBottom>{t('Products')}</Typography>
                )}

                {order.items.length > 0 && (
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: '#d9d9d9' }}>
                                <TableCell align="left">{t('ID')}</TableCell>
                                <TableCell align="left">{t('Name')}</TableCell>
                                <TableCell align="left">{t('Unit')}</TableCell>
                                <TableCell align="left">{t('Quantity')}</TableCell>
                                <TableCell align="left">{t('PriceUAH')}</TableCell>
                                <TableCell align="left">{t('Total')}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {order.items.map((item) => (
                                <TableRow key={item.productId}>
                                    <TableCell align="left">{item.productId}</TableCell>
                                    <TableCell align="left">{item.productName}</TableCell>
                                    <TableCell align="left">{item.unit}</TableCell>
                                    <TableCell align="left">{item.quantity}</TableCell>
                                    <TableCell align="left">{item.price}</TableCell>
                                    <TableCell align="left">{(item.quantity * item.price).toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
                {order.comment.length > 0 && (
                    <div className='flex justify-between'>
                        <Typography variant="body2" style={{ marginTop: '20px', textAlign: 'right' }}>
                            {t('Comment')}:
                        </Typography>
                        <Typography variant="body2" style={{ marginTop: '20px', textAlign: 'right' }}>
                            {order.comment}
                        </Typography>
                    </div>
                )}

                <Typography variant="h6" style={{ marginTop: '20px', textAlign: 'left' }}>
                    {t('Total')} {order.sum.toFixed(2)}
                </Typography>
            </DialogContent>
        </Dialog>
    );
};

export default OrderDetailsDialog;
