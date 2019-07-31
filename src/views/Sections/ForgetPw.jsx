import React from "react";

import PropTypes from "prop-types";

import withStyles from "@material-ui/core/styles/withStyles";
import InputAdornment from "@material-ui/core/InputAdornment";

import Email from "@material-ui/icons/Email";
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

import image from "assets/img/forgetpw.jpg";
import signupPageStyle from "assets/jss/material-kit-react/views/loginPage";

import "assets/css/custom-style.css"

class ForgetPw extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            cardAnimaton: "cardHidden",
            email: "",
            anchorEl: null,
            isValid: true,
            isSuccess: false,
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
            isValid: true,
            isSuccess: false
        });
    }
    handleChange = e => {
        this.setState({
            email: e.target.value
        })
    }

    handleSubmit = async e => {
        e.preventDefault();
        let url = 'https://jftjf-backend.herokuapp.com/forgetpassword'
        let data = {
            'email': this.state.email
        }
        let response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                "content-Type": "application/json"
            }
        })
        let jsonData = await response.json()

        if (jsonData.success === 'false') {
            this.setState({ anchorEl: e.currentTarget, isValid: false })
        } else {
            this.setState({ anchorEl: e.currentTarget, isSuccess: true })

        }
        setTimeout(() => this.handleClose(), 2000)
    }
    SnackBar = () => {
        if (!this.state.isValid) {
            return <SnackbarContent
                message={
                    <span>
                        Email does not exist!
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
                        Token has been sent to your email!
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

        return (
            <div>
                <Header
                    absolute
                    color="transparent"
                    brand="Joy Foods"
                    rightLinks={<HeaderLinks />}
                    {...rest}
                />
                <div
                    className={classes.pageHeader}
                    style={{
                        backgroundImage: "url(" + image + ")",
                        backgroundSize: "cover",
                        backgroundPosition: "center"
                    }}
                >
                    <div className={classes.container}>
                        <GridContainer justify="center">
                            <GridItem xs={12} sm={12} md={4}>
                                {(this.state.isValid === false || this.state.isSuccess === true)
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
                                        <h4>Forget Password</h4>
                                    </CardHeader>
                                    <form className={`${classes.form} cardAcc`}>
                                        <CardBody>
                                            <CustomInput
                                                labelText="Email"
                                                id="email"
                                                inputRootCustomClasses={classes.inputRootCustomClasses}
                                                formControlProps={{
                                                    fullWidth: true,
                                                    className: classes.formControl,
                                                }}
                                                inputProps={{
                                                    "aria-label": "email",
                                                    type: "email",
                                                    name: "email",
                                                    value: this.state.email,
                                                    autoFocus: true,
                                                    required: true,
                                                    onChange: this.handleChange,
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <Email className={classes.inputIconsColor} />
                                                        </InputAdornment>
                                                    )
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

ForgetPw.propTypes = {
    classes: PropTypes.object
};

export default withStyles(signupPageStyle)(ForgetPw);
