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

class EditRecipe extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.location.state.data.id,
            junkfood: props.location.state.data.junkfood,
            joyfood: props.location.state.data.name,
            tip: props.location.state.data.tip,
            nutrition: props.location.state.data.nutrition,
            ingredient: props.location.state.data.ingredient,
            method: props.location.state.data.method,
            imgUrl: props.location.state.data.img_url,
            resName: props.location.state.data.res_name,
            resDescription: props.location.state.data.res_description,
            resWebsite: props.location.state.data.res_website,
            resAddress: props.location.state.data.res_address,
            resImgUrl: props.location.state.data.res_imgurl,
            resPhone: props.location.state.data.res_phone,
            uploadedFile: [],
            resUploadedFile: [],
            isEdited: false,
            restaurantData: [],
        }
    }

    componentDidMount() {
        this.getRestaurant()
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

    editRecipe = async e => {
        e.preventDefault();
        const { id, joyfood, junkfood, tip, nutrition, ingredient, method, imgUrl } = this.state
        let url = `https://jftjf-backend.herokuapp.com/edit/recipe/${id}`
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
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${localStorage.getItem('token')}`
            }
        })

        if (!this.props.location.state.isAdmin) {
            alert(`You've edited ${joyfood.toUpperCase()}`)
            this.setState({
                isEdited: true
            })
        }
    }

    // For admin restaurant

    getRestaurant = async () => {
        let url = `https://jftjf-backend.herokuapp.com/getrestaurant`
        let response = await fetch(url, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${localStorage.getItem('token')}`
            }
        })
        let jsonData = await response.json()
        this.setState({
            restaurantData: jsonData.restaurant
        })
    }



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
        const { id, joyfood, resAddress, resDescription, resImgUrl, resName, resPhone, resWebsite, restaurantData } = this.state
        let url = `https://jftjf-backend.herokuapp.com/edit/restaurant/${id}`
        let data = {
            'resName': resName.toLowerCase(),
            'resDescription': resDescription,
            'resPhone': resPhone,
            'resWeb': resWebsite,
            'resAddress': resAddress,
            'resImgUrl': resImgUrl,
            'joyfood': joyfood.toLowerCase()
        }

        await fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${localStorage.getItem('token')}`
            }
        })
    }

    putRestaurant = async e => {
        const { id, joyfood, resAddress, resDescription, resImgUrl, resName, resPhone, resWebsite, restaurantData } = this.state
        let url = `https://jftjf-backend.herokuapp.com/edit/restaurant/${id}`
        let data = {
            'resName': resName.toLowerCase(),
            'resDescription': resDescription,
            'resPhone': resPhone,
            'resWeb': resWebsite,
            'resAddress': resAddress,
            'resImgUrl': resImgUrl,
            'joyfood': joyfood.toLowerCase()
        }

        await fetch(url, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${localStorage.getItem('token')}`
            }
        })
    }

    editRestaurant = e => {
        let temp = false;

        e.preventDefault();
        const { id, joyfood, restaurantData } = this.state

        for (let i = 0; i < restaurantData.length; i++) {
            if (restaurantData[i].joyfood_id == id) {
                temp = true
            }
        }

        if (!temp) {
            this.postRestaurant(e)
            alert(`You've added ${joyfood.toUpperCase()}`)
        } else {
            this.putRestaurant(e)
            alert(`You've edited ${joyfood.toUpperCase()}`)
        }

        this.setState({
            isEdited: true,
        })
    }

    editAll = e => {
        e.preventDefault();
        this.editRecipe(e);
        this.editRestaurant(e);
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

        const { classes, ...rest } = this.props;
        const { isLogin, name } = this.props.location.state
        const { joyfood, junkfood, tip, nutrition, ingredient, method, imgUrl, isEdited } = this.state

        if (!isLogin) {
            alert("You have to log in to edit recipes!")
            return <Redirect to="/login-page" />
        }
        if (isEdited) return <Redirect to="/discover" />

        return (
            <div>
                <Header
                    color="transparent"
                    brand="Joy Foods"
                    rightLinks={<HeaderLinks clearToken={this.props.location.clearToken} isLogin={isLogin} name={name} />}
                    fixed
                    changeColorOnScroll={{
                        height: 200,
                        color: "white"
                    }}
                    {...rest}
                />
                <Parallax small filter image={require("assets/img/editrecipe.jpg")} />
                <div className={classNames(classes.main, classes.mainRaised)}>
                    <form className={`${classes.container} addMoreForm`}>
                        <Container>
                            <Row>
                                <Col>
                                    <TextField
                                        id="junkfood"
                                        label="Junk food to be replaced"
                                        className={newClasses.textField}
                                        onChange={this.handleChange('junkfood')}
                                        margin="normal"
                                        variant="outlined"
                                        fullWidth
                                        required
                                        defaultValue={junkfood}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <TextField
                                        id="joyfood"
                                        label="Joy food"
                                        className={newClasses.textField}
                                        onChange={this.handleChange('joyfood')}
                                        margin="normal"
                                        variant="outlined"
                                        fullWidth
                                        required
                                        defaultValue={joyfood}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Row>
                                    <Col>
                                        <TextField
                                            id="outlined-tip-flexible"
                                            label="Description"
                                            multiline
                                            fullWidth
                                            required
                                            defaultValue={tip}
                                            rows="4"
                                            onChange={this.handleChange('tip')}
                                            className={classes.textField}
                                            margin="normal"
                                            variant="outlined"
                                        />
                                    </Col>
                                    <Row>
                                        <Col>
                                            <TextField
                                                id="outlined-ingredient-flexible"
                                                label="Ingredient"
                                                multiline
                                                fullWidth
                                                required
                                                defaultValue={ingredient}
                                                rows="8"
                                                onChange={this.handleChange('ingredient')}
                                                className={classes.textField}
                                                margin="normal"
                                                variant="outlined"
                                            />
                                        </Col>
                                    </Row>
                                </Row>
                                <Col>
                                    <TextField
                                        id="outlined-method-flexible"
                                        label="Method"
                                        multiline
                                        fullWidth
                                        required
                                        defaultValue={method}
                                        rows="8"
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
                                        label="Nutritional Information"
                                        multiline
                                        fullWidth
                                        required
                                        defaultValue={nutrition}
                                        rows="4"
                                        onChange={this.handleChange('nutrition')}
                                        className={classes.textField}
                                        margin="normal"
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
                                                    {imgUrl
                                                        ?
                                                        (
                                                            <div style={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center', border: "1px solid rgba(0, 0, 0, 0.23)", borderRadius: "4px" }}>
                                                                <img
                                                                    width="50%"
                                                                    height="90%"
                                                                    src={imgUrl}
                                                                />
                                                            </div>
                                                        )
                                                        :
                                                        <div style={{ width: "100%", height: 300, justifyContent: "center", alignItems: "center", display: "flex", border: "1px solid rgba(0, 0, 0, 0.23)", borderRadius: "4px" }}>
                                                            <a className="btn" style={{ color: 'black' }} style={{ color: 'black', textAlign: 'center' }}>
                                                                <i className="fas fa-camera-retro" />
                                                                &nbsp;
                                                                <strong>Drop or click here to upload you image</strong>
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
                        {(!this.props.location.state.isAdmin)
                            &&
                            <div style={{ textAlign: 'center' }}>
                                <Button style={{ backgroundColor: "#4a895a", color: "white", marginBottom: 15 }} size="lg" onClick={this.editRecipe}>
                                    Edit Now
                            </Button>
                            </div>
                        }
                    </form>


                    {(this.props.location.state.isAdmin)
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
                                            value={this.state.resDescription}
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
                                            value={this.state.resWebsite}
                                            onChange={this.handleChange('resWebsite')}
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
                                <Button style={{ backgroundColor: "#4a895a", color: "white", marginBottom: 15 }} size="lg" onClick={this.editAll}>
                                    Edit All
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

EditRecipe.propTypes = {
    classes: PropTypes.object
};

export default withStyles(profilePageStyle)(EditRecipe);
