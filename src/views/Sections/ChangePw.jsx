import React from "react";

import PropTypes from "prop-types";

import withStyles from "@material-ui/core/styles/withStyles";
import InputAdornment from "@material-ui/core/InputAdornment";

import Icon from "@material-ui/core/Icon";
import Warning from "@material-ui/icons/Warning";
import Check from "@material-ui/icons/Check";

import Header from "components/Header/Header.jsx";
import HeaderLinks from "components/Header/HeaderLinks.jsx";
import Footer from "components/Footer/Footer.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import SnackbarContent from "components/Snackbar/SnackbarContent.jsx";
import Popover from '@material-ui/core/Popover';

import image from "assets/img/changepw.jpg";
import signupPageStyle from "assets/jss/material-kit-react/views/loginPage";

import "assets/css/custom-style.css"

class ResetPw extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            cardAnimaton: "cardHidden",
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
            anchorEl: null,
            isMatch: true,
            isShort: false,
            isSuccess: false,
            isWrong: false,
        };
    }
    componentDidMount() {
        setTimeout(
            function () {
                this.setState({ cardAnimaton: "" });
            }.bind(this),
            700
        );
    }
    handleClose = () => {
        this.setState({
            anchorEl: null,
            isMatch: true,
            isShort: false,
            isWrong: false,
        });
    }
    handleChange = name => e => {
        this.setState({
            ...this.state,
            [name]: e.target.value
        })
    }

    handleSubmit = async e => {
        const { currentPassword, newPassword, confirmPassword } = this.state;

        e.preventDefault();
        this.setState({
            anchorEl: e.currentTarget
        })

        if (newPassword !== confirmPassword) {
            this.setState({
                isMatch: false
            })
        } else if (/^\s*$/.test(newPassword)) {
            this.setState({
                isShort: true
            })
        } else {
            let url = `https://jftjf-backend.herokuapp.com/resetpassword`
            let data = {
                'current_password': currentPassword,
                'new_password': newPassword
            }
            let response = await fetch(url, {
                method: 'PUT',
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${sessionStorage.getItem('token')}`
                }
            })
            let jsonData = await response.json()
            console.log('dataaaaaa', jsonData)
            if (jsonData.success === "true") {
                this.setState({
                    isSuccess: true
                })
            } else {
                this.setState({
                    isWrong: true
                })
            }
        }

        setTimeout(() => this.handleClose(), 1500)
    }

    SnackBar = () => {
        if (this.state.isShort) {
            return <SnackbarContent
                message={
                    <span>
                        Password must contain more than 3 characters!
                    </span>
                }
                close
                color="warning"
                icon={Warning}
            />
        } else if (!this.state.isMatch) {
            return <SnackbarContent
                message={
                    <span>
                        Passwords do not match!
                    </span>
                }
                close
                color="warning"
                icon={Warning}
            />
        } else if (this.state.isWrong) {
            return <SnackbarContent
                message={
                    <span>
                        Current password is incorrect!
                    </span>
                }
                close
                color="warning"
                icon={Warning}
            />
        } else if (this.state.isSuccess) {
            return <SnackbarContent
                message={
                    <span>
                        You have updated your password!
                    </span>
                }
                close
                color="success"
                icon={Check}
            />
        }
    }

    render() {
        const open = Boolean(this.state.anchorEl)
        const { classes, ...rest } = this.props;
        const { isLogin, name, token } = this.props.location.state;

        return (
            <div>
                <Header
                    absolute
                    color="transparent"
                    brand="Joy Foods"
                    rightLinks={<HeaderLinks clearToken={this.props.location.clearToken} isLogin={isLogin} name={name} token={token} />}
                    {...rest}
                />
                <div
                    className={classes.pageHeader}
                    style={{
                        backgroundImage: "url(" + image + ")",
                        backgroundSize: "cover",
                        backgroundPosition: "top center"
                    }}
                >
                    <div className={classes.container}>
                        <GridContainer justify="center">
                            <GridItem xs={12} sm={12} md={4}>
                                {(this.state.isShort === true || this.state.isMatch === false || this.state.isSuccess === true || this.state.isWrong === true)
                                    &&
                                    <Popover
                                        open={open}
                                        anchorEl={this.state.anchorEl}
                                        onClose={this.handleClose}
                                        anchorReference="anchorEl"
                                        anchorEl={{ top: 1000 }}
                                        anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'center',
                                        }}
                                        transformOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'center',
                                        }}
                                    >
                                        <this.SnackBar />
                                    </Popover>
                                }
                                <Card className={classes[this.state.cardAnimaton]}>
                                    <CardHeader style={{ backgroundColor: "#4a895a", color: "white" }} className={classes.cardHeader}>
                                        <h4>New Password</h4>
                                    </CardHeader>
                                    <form className={`${classes.form} cardAcc`}>
                                        <CardBody>
                                            <CustomInput
                                                labelText="Current Password"
                                                id="current-password"
                                                formControlProps={{
                                                    fullWidth: true
                                                }}
                                                inputProps={{
                                                    name: "current-password",
                                                    type: "password",
                                                    required: true,
                                                    value: this.state.currentPassword,
                                                    onChange: this.handleChange('currentPassword'),
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <Icon className={classes.inputIconsColor}>
                                                                lock_outline
                              </Icon>
                                                        </InputAdornment>
                                                    ),
                                                    autoComplete: "off"
                                                }}
                                            />
                                            <CustomInput
                                                labelText="New Password"
                                                id="new-password"
                                                formControlProps={{
                                                    fullWidth: true
                                                }}
                                                inputProps={{
                                                    name: "new-password",
                                                    type: "password",
                                                    required: true,
                                                    value: this.state.password,
                                                    onChange: this.handleChange('newPassword'),
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <Icon className={classes.inputIconsColor}>
                                                                lock_outline
                              </Icon>
                                                        </InputAdornment>
                                                    ),
                                                    autoComplete: "off"
                                                }}
                                            />
                                            <CustomInput
                                                labelText="Confirm Password"
                                                id="confirm-password"
                                                formControlProps={{
                                                    fullWidth: true
                                                }}
                                                inputProps={{
                                                    name: "confirm-password",
                                                    type: "password",
                                                    required: true,
                                                    value: this.state.confirmPassword,
                                                    onChange: this.handleChange('confirmPassword'),
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <Icon className={classes.inputIconsColor}>
                                                                lock_outline
                              </Icon>
                                                        </InputAdornment>
                                                    ),
                                                    autoComplete: "off"
                                                }}
                                            />

                                        </CardBody>
                                        <CardFooter className={classes.cardFooter}>
                                            <Button onClick={this.handleSubmit} style={{ backgroundColor: "#4a895a", color: "white" }} size="lg">
                                                Send Now
                      </Button>
                                        </CardFooter>
                                    </form>
                                </Card>
                            </GridItem>
                        </GridContainer>
                    </div>
                    <Footer whiteFont />
                </div>
            </div>
        );
    }
}

ResetPw.propTypes = {
    classes: PropTypes.object
};

export default withStyles(signupPageStyle)(ResetPw);
