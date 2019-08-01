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

import profilePageStyle from "assets/jss/material-kit-react/views/profilePage.jsx";

import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

import { Container, Row, Col } from 'reactstrap'

import Dropzone from "react-dropzone";
import request from "superagent";

import "assets/css/custom-style.css"

class AddMore extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            junkfood: '',
            joyfood: '',
            tip: '',
            nutrition: '',
            ingredient: '',
            method: '',
            imgUrl: '',
            uploadedFile: [],
            isAdded: false,

            resName: '',
            resDescription: '',
            resPhone: '',
            resAddress: '',
            resWeb: '',
            resImgUrl: '',
            resUploadedFile: [],
        }
    }

    handleChange = name => e => {
        this.setState({
            ...this.state,
            [name]: e.target.value
        })
    }
    handleImgDrop = files => {
        this.setState({
            uploadedFile: files[0]
        })
        this.handleImgUpload(files[0])
    }

    handleImgUpload = async file => {
        let upload = request
            .post('https://api.cloudinary.com/v1_1/huynhtehoa/image/upload')
            .field("upload_preset", 'ekcasjxq')
            .field("file", file);

        upload.end((err, response) => {
            if (err) console.error(err)
            this.setState({
                imgUrl: response.body.secure_url,
            })
        })
    }
    postRecipe = async e => {
        e.preventDefault();
        const { joyfood, junkfood, tip, nutrition, ingredient, method, imgUrl } = this.state

        if (/^\s*$/.test(joyfood) === true || /^\s*$/.test(junkfood) === true || /^\s*$/.test(tip) === true || /^\s*$/.test(nutrition) === true || /^\s*$/.test(ingredient) === true || /^\s*$/.test(method) === true) {
            return alert("All inputs are required!")
        } else {
            let url = 'https://jftjf-backend.herokuapp.com/addjoyfood'
            let data = {
                'joyfood': joyfood.toLowerCase(),
                'junkfood': junkfood.toLowerCase(),
                'tip': tip,
                'nutrition': nutrition,
                'ingredient': ingredient,
                'method': method,
                'imgUrl': imgUrl
            }
            await fetch(url, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${sessionStorage.getItem('token')}`
                }
            })
            if (!this.props.isAdmin) {
                alert(`You've added ${joyfood.toUpperCase()}`)
                this.setState({
                    isAdded: true,
                })
            }
        }
    }

    // For admin restaurant

    handleResImgDrop = files => {
        this.setState({
            resUploadedFile: files[0]
        })
        this.handleResImgUpload(files[0])
    }

    handleResImgUpload = async file => {
        let upload = request
            .post('https://api.cloudinary.com/v1_1/huynhtehoa/image/upload')
            .field("upload_preset", 'ekcasjxq')
            .field("file", file);

        upload.end((err, response) => {
            if (err) console.error(err)
            this.setState({
                resImgUrl: response.body.secure_url,
            })
        })
    }

    postRestaurant = async e => {

        e.preventDefault();
        const { joyfood, resAddress, resDescription, resImgUrl, resName, resPhone, resWeb } = this.state

        let url = 'https://jftjf-backend.herokuapp.com/addrestaurant'
        let data = {
            'resName': resName.toLowerCase(),
            'resDescription': resDescription,
            'resPhone': resPhone,
            'resWeb': resWeb,
            'resAddress': resAddress,
            'resImgUrl': resImgUrl,
            'joyfood': joyfood.toLowerCase()
        }
        await fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${sessionStorage.getItem('token')}`
            }
        })
        if (!this.props.isAdmin) {
            alert(`You've added ${joyfood.toUpperCase()}`)
            this.setState({
                isAdded: true,
            })
        }
    }

    postAll = e => {
        e.preventDefault();
        this.postRecipe(e);
        this.postRestaurant(e);
    }

    //

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
        if (!this.props.isLogin) {
            alert('Please log in to add recipes!')
            return <Redirect to='/login-page' />
        }
        if (this.state.isAdded) return <Redirect to='/discover' />
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
                    <form className={`${classes.container} addMoreForm`}>
                        <Container>
                            <Row>
                                <Col>
                                    <TextField
                                        id="junkfood"
                                        label="Junk food to be replaced"
                                        className={newClasses.textField}
                                        value={this.state.junkfood}
                                        onChange={this.handleChange('junkfood')}
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
                                        id="joyfood"
                                        label="Joy food"
                                        className={newClasses.textField}
                                        value={this.state.joyfood}
                                        onChange={this.handleChange('joyfood')}
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
                                        id="outlined-tip-flexible"
                                        label="Description"
                                        multiline
                                        fullWidth
                                        required
                                        rows="4"
                                        value={this.state.tip}
                                        onChange={this.handleChange('tip')}
                                        className={classes.textField}
                                        margin="normal"
                                        variant="outlined"
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <TextField
                                        id="outlined-ingredient-flexible"
                                        label="Ingredients"
                                        multiline
                                        fullWidth
                                        required
                                        rows="8"
                                        value={this.state.ingredient}
                                        onChange={this.handleChange('ingredient')}
                                        className={classes.textField}
                                        margin="normal"
                                        variant="outlined"
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <TextField
                                        id="outlined-method-flexible"
                                        label="Method"
                                        multiline
                                        fullWidth
                                        required
                                        rows="8"
                                        value={this.state.method}
                                        onChange={this.handleChange('method')}
                                        className={classes.textField}
                                        margin="normal"
                                        variant="outlined"
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <TextField
                                        id="outlined-nutrition-flexible"
                                        label="Nutritional Facts"
                                        multiline
                                        fullWidth
                                        margin="normal"
                                        required
                                        rows="4"
                                        value={this.state.nutrition}
                                        onChange={this.handleChange('nutrition')}
                                        className={classes.textField}
                                        variant="outlined"
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col style={{ padding: "15px 0" }}>
                                    <Dropzone
                                        onDrop={this.handleImgDrop}
                                        accept="image/*"
                                        multiple={false}
                                    >
                                        {({ getRootProps, getInputProps }) => {
                                            return (
                                                <div {...getRootProps()}>
                                                    <input {...getInputProps()} />
                                                    {this.state.imgUrl
                                                        ?
                                                        (
                                                            <div style={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center', border: "1px solid rgba(0, 0, 0, 0.23)", borderRadius: "4px" }}>
                                                                <img
                                                                    width="50%"
                                                                    height="90%"
                                                                    src={this.state.imgUrl}
                                                                />
                                                            </div>
                                                        )
                                                        :
                                                        <div style={{ width: "100%", height: 300, justifyContent: "center", alignItems: "center", display: "flex", border: "1px solid rgba(0, 0, 0, 0.23)", borderRadius: "4px" }}>
                                                            <a className="btn" style={{ color: 'black', textAlign: 'center' }}>
                                                                <i className="fas fa-camera-retro" />
                                                                &nbsp;
                                                                <strong>Drag or click here to upload your image</strong>
                                                            </a>
                                                        </div>
                                                    }
                                                </div>
                                            );
                                        }}
                                    </Dropzone>
                                </Col>
                            </Row>
                        </Container>
                        {(!isAdmin)
                            &&
                            <div style={{ textAlign: 'center' }}>
                                <Button style={{ backgroundColor: "#4a895a", color: "white", marginBottom: 15 }} size="lg" onClick={this.postRecipe}>
                                    Add Now
                            </Button>
                            </div>
                        }
                    </form>


                    {(isAdmin)
                        &&
                        <form className={`${classes.container} addMoreForm`}>
                            <h2>For Restaurant</h2>
                            <Container>
                                <Row>
                                    <Col>
                                        <TextField
                                            id="re-name"
                                            label="Restaurant Name"
                                            className={newClasses.textField}
                                            value={this.state.resName}
                                            onChange={this.handleChange('resName')}
                                            margin="normal"
                                            variant="outlined"
                                            fullWidth
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <TextField
                                            id="res-des"
                                            label="Restaurant Description"
                                            multiline
                                            fullWidth
                                            rows="4"
                                            value={this.state.restaurantDescription}
                                            onChange={this.handleChange('resDescription')}
                                            className={classes.textField}
                                            margin="normal"
                                            variant="outlined"
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <TextField
                                            id="res-phone"
                                            label="Restaurant Phone"
                                            className={newClasses.textField}
                                            value={this.state.resPhone}
                                            onChange={this.handleChange('resPhone')}
                                            margin="normal"
                                            variant="outlined"
                                            fullWidth
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <TextField
                                            id="res-address"
                                            label="Restaurant Address"
                                            className={newClasses.textField}
                                            value={this.state.resAddress}
                                            onChange={this.handleChange('resAddress')}
                                            margin="normal"
                                            variant="outlined"
                                            fullWidth
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <TextField
                                            id="res-web"
                                            label="Restaurant Website"
                                            className={newClasses.textField}
                                            value={this.state.resWeb}
                                            onChange={this.handleChange('resWeb')}
                                            margin="normal"
                                            variant="outlined"
                                            fullWidth
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col style={{ padding: "15px 0" }}>
                                        <Dropzone
                                            onDrop={this.handleResImgDrop}
                                            accept="image/*"
                                            multiple={false}
                                        >
                                            {({ getRootProps, getInputProps }) => {
                                                return (
                                                    <div {...getRootProps()}>
                                                        <input {...getInputProps()} />
                                                        {this.state.resImgUrl
                                                            ?
                                                            (
                                                                <div style={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center', border: "1px solid rgba(0, 0, 0, 0.23)", borderRadius: "4px" }}>
                                                                    <img
                                                                        width="50%"
                                                                        height="90%"
                                                                        src={this.state.resImgUrl}
                                                                    />
                                                                </div>
                                                            )
                                                            :
                                                            <div style={{ width: "100%", height: 300, justifyContent: "center", alignItems: "center", display: "flex", border: "1px solid rgba(0, 0, 0, 0.23)", borderRadius: "4px" }}>
                                                                <a className="btn" style={{ color: 'black', textAlign: 'center' }}>
                                                                    <i className="fas fa-camera-retro" />
                                                                    &nbsp;
                                                                <strong>Drag or click here to upload restaurant image</strong>
                                                                </a>
                                                            </div>
                                                        }
                                                    </div>
                                                );
                                            }}
                                        </Dropzone>
                                    </Col>
                                </Row>
                            </Container>
                            <div style={{ textAlign: 'center' }}>
                                <Button style={{ backgroundColor: "#4a895a", color: "white", marginBottom: 15 }} size="lg" onClick={this.postAll}>
                                    Add All
                            </Button>
                            </div>
                        </form>
                    }





                </div>
                <Footer />
            </div >
        );
    }
}

AddMore.propTypes = {
    classes: PropTypes.object
};

export default withStyles(profilePageStyle)(AddMore);
