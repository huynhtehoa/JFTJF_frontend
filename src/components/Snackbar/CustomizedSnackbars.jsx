import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Button from '@material-ui/core/Button';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import { amber, green } from '@material-ui/core/colors';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import WarningIcon from '@material-ui/icons/Warning';
import { makeStyles } from '@material-ui/core/styles';

const variantIcon = {
    success: CheckCircleIcon,
    warning: WarningIcon,
    error: ErrorIcon,
    info: InfoIcon,
};

const useStyles1 = makeStyles(theme => ({
    success: {
        backgroundColor: green[600],
    },
    error: {
        backgroundColor: theme.palette.error.dark,
    },
    info: {
        backgroundColor: theme.palette.primary.main,
    },
    warning: {
        backgroundColor: amber[700],
    },
    icon: {
        fontSize: 20,
    },
    iconVariant: {
        opacity: 0.9,
        marginRight: theme.spacing(1),
    },
    message: {
        display: 'flex',
        alignItems: 'center',
    },
}));

function MySnackbarContentWrapper(props) {
    const classes = useStyles1();
    const { className, message, onClose, variant, ...other } = props;
    const Icon = variantIcon[variant];

    return (
        <SnackbarContent
            className={clsx(classes[variant], className)}
            aria-describedby="client-snackbar"
            message={
                <span id="client-snackbar" className={classes.message}>
                    <Icon className={clsx(classes.icon, classes.iconVariant)} />
                    {message}
                </span>
            }
            action={[
                <IconButton key="close" aria-label="Close" color="inherit" onClick={onClose}>
                    <CloseIcon className={classes.icon} />
                </IconButton>,
            ]}
            {...other}
        />
    );
}

MySnackbarContentWrapper.propTypes = {
    className: PropTypes.string,
    message: PropTypes.node,
    onClose: PropTypes.func,
    variant: PropTypes.oneOf(['success', 'warning', 'error', 'info']).isRequired,
};

const useStyles2 = makeStyles(theme => ({
    margin: {
        margin: theme.spacing(1),
    },
}));


export default function CustomizedSnackbars(props) {
    const classes = useStyles2();
    const [open, setOpen] = React.useState(false);

    const { isChecked, isEmailExist, isMatch, isPasswordShort, isUsernameExist, isUsernameShort, isValid, isNotificationOpen, handleClose } = props
    console.log('noti', isNotificationOpen)
    console.log('matchh', isMatch)

    React.useEffect(() => setOpen(isNotificationOpen), [open]) 

    return (
        <div>
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}
            >
                <MySnackbarContentWrapper
                    variant="warning"
                    className={classes.margin}
                    message="Password must contain at least 8 characters"
                />
                <MySnackbarContentWrapper
                    variant="warning"
                    className={isMatch ? "hiddenMessagePassMatch" + classes.margin : "showMessage" + classes.margin}
                    message="Password unmatched"
                />
                <MySnackbarContentWrapper
                    variant="warning"
                    className={!isUsernameShort ? "hiddenMessageNameLen" + classes.margin : "showMessage" + classes.margin}
                    message="Username must contain more than 3 characters"
                />
                <MySnackbarContentWrapper
                    variant="warning"
                    className={!isUsernameExist ? "hiddenMessageNameExist" + classes.margin : "showMessage" + classes.margin}
                    message="Username already exists"
                />
                <MySnackbarContentWrapper
                    variant="warning"
                    className={!isValid ? "hiddenMessageEmailFormat" + classes.margin : "showMessage" + classes.margin}
                    message="Email already exists"
                />
                <MySnackbarContentWrapper
                    variant="success"
                    className={classes.margin}
                    message="This is a success message!"
                />
            </Snackbar>
        </div>
    );
}