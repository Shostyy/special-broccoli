import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, IconButton, Table, TableBody, TableCell, TableRow, TableHead, Typography, Paper, Box } from '@mui/material';
import { format } from 'date-fns';
import CloseIcon from '@mui/icons-material/Close';
import { OrderData } from '../../../../../api/types/orderData';
import CheckIcon from '@mui/icons-material/Check';
import { ONE_THIRD_PERCENT, STATUS_COLORS, STATUS_STEPS } from '../../../../../data/constants/constants';
import styles from './styles/styles.module.css';

interface OrderDetailsDialogProps {
    order: OrderData | null;
    onClose: () => void;
}

const OrderDetailsDialog: React.FC<OrderDetailsDialogProps> = ({ order, onClose }) => {
    const { t } = useTranslation();

    if (!order) return null;

    const currentStatusIndex = STATUS_STEPS.indexOf(order.status);
    const progressWidth = currentStatusIndex * ONE_THIRD_PERCENT;

    return (
        <Dialog open={!!order} onClose={onClose} maxWidth="lg" fullWidth className={styles.dialog}>
            <DialogContent className={styles.dialogContent}>
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    className={styles.closeButton}
                >
                    <CloseIcon />
                </IconButton>

                <Box className={styles.statusContainer}>
                    <Paper elevation={1} className={styles.statusPaper}>
                        <Typography variant="body2" style={{ marginRight: '16px' }}>
                            {t('TradePoint')}:
                        </Typography>
                        <Typography variant="body2" style={{ marginRight: '16px' }}>
                            {order.tradePoint.name}
                        </Typography>
                    </Paper>
                    <Paper elevation={1} className={styles.statusPaper}>
                        <Typography variant="body2" style={{ marginRight: '16px' }}>
                            {t('StatusOfOrder')}:
                        </Typography>
                        <Box
                            className={styles.statusDot}
                            style={{ backgroundColor: STATUS_COLORS[order.status] }}
                        />
                        <Typography variant="body2" style={{ marginRight: '16px' }}>
                            {t(order.status)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {format(order.dateCreated, 'dd-MM-yyyy HH:mm:ss')}
                        </Typography>
                    </Paper>
                </Box>

                <Box className={styles.progressContainer}>
                    <Box className={styles.progressBar}>
                        <Box
                            className={styles.progressFill}
                            style={{ width: `${progressWidth}%` }}
                        />
                        {STATUS_STEPS.map((status, index) => {
                            const colors = ['#FFFFFF', '#7BD0E5', '#98783B', '#3C3E6B'];
                            return (
                                <Box
                                    key={index}
                                    className={styles.statusStep}
                                    style={{ left: `${index * ONE_THIRD_PERCENT}%` }}
                                >
                                    <Box
                                        className={styles.statusStepCircle}
                                        style={{ backgroundColor: index <= currentStatusIndex ? colors[index] : '#e0e0e0' }}
                                    >
                                        {index === STATUS_STEPS.length - 1 && currentStatusIndex === STATUS_STEPS.length - 1 && (
                                            <CheckIcon style={{ color: 'white' }} />
                                        )}
                                    </Box>
                                    <Typography className={styles.statusStepLabel}>
                                        {t(status)}
                                    </Typography>
                                    {index === currentStatusIndex && (
                                        <Typography className={styles.statusStepDate}>
                                            {format(order.dateCreated, 'dd-MM-yyyy HH:mm:ss')}
                                        </Typography>
                                    )}
                                </Box>
                            );
                        })}
                    </Box>
                </Box>

                {!!order.items.length && (
                    <Typography variant="h6" gutterBottom>{t('Products')}</Typography>
                )}

                {!!order.items.length && (
                    <Table className={styles.productTable}>
                        <TableHead className={styles.productTableHead}>
                            <TableRow>
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
                            <TableRow key={'total'}>
                                <TableCell align="left" sx={{fontWeight: 'bold'}}>{t('Sum')}</TableCell>
                                <TableCell align="left"></TableCell>
                                <TableCell align="left"></TableCell>
                                <TableCell align="left"></TableCell>
                                <TableCell align="left"></TableCell>
                                <TableCell align="left" sx={{fontWeight: 'bold'}}>{order.sum.toFixed(2)}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                )}
                {!!order.comment.length && (
                    <div className={styles.commentContainer}>
                        <Typography variant="body2">
                            {t('Comment')}:
                        </Typography>
                        <Typography variant="body2">
                            {order.comment}
                        </Typography>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default OrderDetailsDialog;