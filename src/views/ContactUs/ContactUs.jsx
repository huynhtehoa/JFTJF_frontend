import React from "react";
import { Redirect } from "react-router-dom";

import PropTypes from "prop-types";

import classNames from "classnames";

import withStyles from "@material-ui/core/styles/withStyles";

import Header from "components/Header/Header.jsx";
import Footer from "components/Footer/Footer.jsx";
import Button from "components/CustomButtons/Button.jsx";
import HeaderLinks from "components/Header/HeaderLinks.jsx";
import Parallax from "components/Parallax/Parallax.jsx";
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import SnackbarContent from "components/Snackbar/SnackbarContent.jsx";
import Popover from '@material-ui/core/Popover';
import TextField from '@material-ui/core/TextField';

import Warning from "@material-ui/icons/Warning";
import Check from "@material-ui/icons/Check";

import profilePageStyle from "assets/jss/material-kit-react/views/profilePage.jsx";

import { makeStyles } from '@material-ui/core/styles';

import { Container, Row, Col } from 'reactstrap'

import "assets/css/custom-style.css"
import { FlashOnRounded } from "@material-ui/icons";

class ContactUs extends React.Component {
    constructor(props) {
        super(props);

        this.inputLabel = React.createRef();

        this.state = {
            name: '',
            company: '',
            email: '',
            phone: '',
            note: '',
            business: '',
            labelWidth: 0,
            isEmailValid: true,
            isNameValid: true,
            anchorEl: null,
            isSent: false,
            isFinished: false,
        }
    }

    componentDidMount = () => {
        this.setState({
            labelWidth: this.inputLabel.current.offsetWidth
        })
    }

    handleChange = name => e => {
        this.setState({
            ...this.state,
            [name]: e.target.value
        })
    }

    sendContact = e => {

        e.preventDefault();
        const { name, email } = this.state

        if (name.length < 3) {
            this.setState({
                isNameValid: false,
                anchorEl: e.currentTarget
            })
            setTimeout(() => this.handleClose(), 1500)
        } else {
            this.setState({
                isNameValid: true,
                anchorEl: null
            })
        }

        if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) == false) {
            this.setState({
                isEmailValid: false,
                anchorEl: e.currentTarget
            })
            setTimeout(() => this.handleClose(), 1500)
        } else {
            this.setState({
                isEmailValid: true,
                anchorEl: null
            })
        }

        this.setState({
            isFinished: true
        }, () => this.finishFunction(e))
    }

    finishFunction = async e => {
        const { name, email, company, phone, note, business, isEmailValid, isNameValid } = this.state

        if (isEmailValid === true && isNameValid === true) {
            let url = 'https://jftjf-backend.herokuapp.com/contactus'
            let data = {
                'name': name,
                'email': email,
                'company': company,
                'phone': phone,
                'note': note,
                'business': business
            }

            await fetch(url, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    "content-Type": "application/json",
                }
            })
            this.setState({
                isSent: true,
                anchorEl: e.currentTarget
            })
            setTimeout(() => this.handleClose(), 1500)
        } else {
            this.setState({
                isSent: true,
            })
        }
    }

    handleClose = () => {
        this.setState({
            anchorEl: null
        });
    }

    SnackBar = () => {
        if (!this.state.isNameValid) {
            return <SnackbarContent
                message={<span>Please input a valid name!</span>}
                close
                color="warning"
                icon={Warning}
            />
        } else if (!this.state.isEmailValid) {
            return <SnackbarContent
                message={<span>Incorrect email format!</span>}
                close
                color="warning"
                icon={Warning}
            />
        } else if (this.state.isSent) {
            return <SnackbarContent
                message={<span>Thank you for contacting us! We will get back to you shortly!</span>}
                close
                color="success"
                icon={Check}
            />
        }
    }

    render() {
        const newClasses = makeStyles(theme => ({
            container: {
                display: 'flex',
                flexWrap: 'wrap',
            },
            textField: {
                marginLeft: theme.spacing(1),
                marginRight: theme.spacing(1),
            },
            dense: {
                marginTop: theme.spacing(2),
            },
            menu: {
                width: 200,
            },
        }));

        const { classes, isLogin, clearToken, name, token, isAdmin, ...rest } = this.props;
        const open = Boolean(this.state.anchorEl)

        return (
            <div>
                <Header
                    color="transparent"
                    brand="Joy Foods"
                    rightLinks={<HeaderLinks clearToken={clearToken} isLogin={isLogin} name={name} token={token} />}
                    fixed
                    changeColorOnScroll={{
                        height: 200,
                        color: "white"
                    }}
                    {...rest}
                />
                <Parallax small filter image={require("assets/img/addmore.jpg")} />
                <div className={classNames(classes.main, classes.mainRaised)}>
                    <form className={`${classes.container} addMoreForm contactUsForm`} onSubmit={this.sendContact} >
                        <Container>
                            {(this.state.isEmailValid === false || this.state.isNameValid === false || this.state.isSent === true)
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
                                </Popover>}
                            <Row>
                                <Col>
                                    <TextField
                                        id="name"
                                        label="Your name"
                                        className={newClasses.textField}
                                        value={this.state.name}
                                        onChange={this.handleChange('name')}
                                        margin="normal"
                                        variant="outlined"
                                        fullWidth
                                        required
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <TextField
                                        id="company"
                                        label="Company"
                                        className={newClasses.textField}
                                        value={this.state.company}
                                        onChange={this.handleChange('company')}
                                        margin="normal"
                                        variant="outlined"
                                        fullWidth
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <FormControl variant="outlined" style={{ width: "100%", marginTop: "8px" }}>
                                        <InputLabel ref={this.inputLabel} htmlFor="business">
                                            Type of Business
                                        </InputLabel>
                                        <Select
                                            fullWidth
                                            onChange={this.handleChange("business")}
                                            value={this.state.business}
                                            input={
                                                <OutlinedInput name="business" labelWidth={this.state.labelWidth} id="business" />
                                            }
                                        >
                                            <MenuItem value="Individual">Individual</MenuItem>
                                            <MenuItem value="Corporate">Corporate</MenuItem>
                                            <MenuItem value="Others">Others</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <TextField
                                        id="email"
                                        label="Email"
                                        className={newClasses.textField}
                                        value={this.state.email}
                                        onChange={this.handleChange('email')}
                                        margin="normal"
                                        variant="outlined"
                                        fullWidth
                                        required
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <TextField
                                        id="phone"
                                        label="Phone"
                                        className={newClasses.textField}
                                        value={this.state.phone}
                                        onChange={this.handleChange('phone')}
                                        margin="normal"
                                        variant="outlined"
                                        fullWidth
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <TextField
                                        id="note"
                                        label="Note"
                                        multiline
                                        fullWidth
                                        rows="4"
                                        value={this.state.note}
                                        onChange={this.handleChange('note')}
                                        className={classes.textField}
                                        margin="normal"
                                        variant="outlined"
                                    />
                                </Col>
                            </Row>
                        </Container>
                        <div style={{ textAlign: 'center' }}>
                            <Button style={{ backgroundColor: "#4a895a", color: "white", marginBottom: 15 }} size="lg" onClick={this.sendContact}>
                                Contact Now
                            </Button>
                        </div>
                    </form>
                </div>
                <Footer />
            </div >
        );
    }
}

ContactUs.propTypes = {
    classes: PropTypes.object
};

export default withStyles(profilePageStyle)(ContactUs);
