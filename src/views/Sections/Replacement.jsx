import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import PropTypes from "prop-types";

import classNames from "classnames";

import withStyles from "@material-ui/core/styles/withStyles";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Warning from "@material-ui/icons/Warning";
import Check from "@material-ui/icons/Check";

import Header from "components/Header/Header.jsx";
import Footer from "components/Footer/Footer.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import HeaderLinks from "components/Header/HeaderLinks.jsx";
import Parallax from "components/Parallax/Parallax.jsx";

import profilePageStyle from "assets/jss/material-kit-react/views/profilePage.jsx";
import moment from 'moment';

import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Tooltip from "@material-ui/core/Tooltip";
import { VerticleButton as ScrollUpButton } from "react-scroll-up-button";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import SnackbarContent from "components/Snackbar/SnackbarContent.jsx";
import Popover from '@material-ui/core/Popover';
import Button from '@material-ui/core/Button';

import "assets/css/custom-style.css"

const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
}));

const Replacement = props => {

  const newClasses = useStyles();

  const { classes, ...rest } = props;
  const { name, isLogin, searchData, token, inputSearch } = props.location.state

  const [menuOpen, setMenuOpen] = useState([])
  const [cardExpanded, setCardExpanded] = useState([])
  const [isLiked, setIsLiked] = useState([])
  const [cloneSearchData, setCloneSearchData] = useState([searchData]);
  const [searchInput, setSearchInput] = useState('');
  const [anchorMs, setAnchorMs] = useState(null)
  const [liked, setLiked] = useState(false)
  const [disliked, setDisliked] = useState(false)
  const [likeWithoutLogin, setLikeWithoutLogin] = useState(false)
  const [position, setPosition] = useState({})
  const [isDeleted, setIsDeleted] = useState(false)

  const handleLikeClick = (e, idx, id, joyfood) => {
    let clone = isLiked.slice(0)
    clone[idx] = !clone[idx]
    setIsLiked(clone)
    sendLike(e, idx, id, joyfood)
  }

  const handlePopClose = () => {
    setAnchorMs(null)
    setLiked(false)
    setDisliked(false)
    setIsDeleted(false)
    setLikeWithoutLogin(false)
  }

  const handleMenuClick = idx => {
    let clone = menuOpen.slice(0)
    clone[idx] = !clone[idx]
    setMenuOpen(clone);
  }

  const handleClick = (e, idx) => {
    setPosition(e.currentTarget.getBoundingClientRect())
    handleMenuClick(idx)
  }

  const handleClose = () => {
    let clone = []
    cloneSearchData.map(data => {
      clone.push(false)
    })
    setMenuOpen(clone)
  }

  const handleExpandClick = idx => {
    let clone = cardExpanded.slice(0)
    clone[idx] = !clone[idx]
    setCardExpanded(clone);
  }

  const doubleFunctionDel = (e, id) => {
    handleClose()
    delRecipe(e, id);
  }

  const onSearchChange = e => {

    setSearchInput(e.target.value)
    if (searchInput === "") {
      setCloneSearchData(searchData)

    } else {
      const filterSearch = cloneSearchData.filter(data => data.ingredient.concat(data.name, data.method).toLowerCase().includes(searchInput.toLowerCase()))
      setCloneSearchData(filterSearch)
    }

    let likeClone = []
    cloneSearchData.map(data => {
      if (!data.is_liked) {
        likeClone.push(false)
      } else if (data.is_liked) {
        likeClone.push(true)
      }
    })
    setIsLiked(likeClone)
  }

  const delRecipe = async (e, id) => {

    setAnchorMs(e.currentTarget)

    let url = `https://jftjf-backend.herokuapp.com/delete/recipe/${id}`
    let data = {
      'view_allowed': false
    }
    await fetch(url, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${sessionStorage.getItem('token')}`
      }
    })

    setIsDeleted(true)
    setTimeout(() => handlePopClose(), 1500)
    setCloneSearchData(searchData)
  }

  useEffect(() => {
    setCloneSearchData(searchData)
    if (isLogin) {
      let likeClone = []
      cloneSearchData.map(data => {
        if (!data.is_liked) {
          likeClone.push(false)
        } else if (data.is_liked) {
          likeClone.push(true)
        }
      })
      setIsLiked(likeClone)
    }
    let clone = []
    cloneSearchData.map(data => {
      clone.push(false)
    })
    setCardExpanded(clone)
    setMenuOpen(clone)
  }, [isLogin])

  const sendLike = async (e, idx, id) => {

    setAnchorMs(e.currentTarget)

    if (!isLogin) {
      setLikeWithoutLogin(true)
    } else {
      let url = `https://jftjf-backend.herokuapp.com/sendlike/${id}`
      let data = {
        'is_liked': Boolean(!isLiked[idx])
      }
      await fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${sessionStorage.getItem('token')}`
        }
      })

      if (isLiked[idx]) {
        setDisliked(true)
      } else {
        setLiked(true)
      }

      setSearchInput("")
      setCloneSearchData(searchData)
    }
    setTimeout(() => handlePopClose(), 1500)
  }
  const RenderNoResults = () => {
    if (!isLogin) {
      return (
        <GridContainer justify="center">
          <GridItem xs={10} sm={10} md={8}>
            <div style={{ height: "45vh", justifyContent: "center", textAlign: "center", display: "flex", flexDirection: "column", paddingBottom: 150 }}>
              <Typography variant="h6" paragraph>Currently, we don't have any healthy recipes for <i style={{ color: "red" }}><b>{inputSearch}</b></i></Typography>
              <Button style={{ backgroundColor: "#4a895a" }} size="lg" >
                <Link to="/login-page" style={{ color: "white" }} >Log in and start to create your own recipes!</Link>
              </Button>
            </div>
          </GridItem>
        </GridContainer>
      )
    } else {
      return (
        <GridContainer justify="center">
          <GridItem xs={10} sm={10} md={8}>
            <div style={{ height: "45vh", justifyContent: "center", textAlign: "center", display: "flex", flexDirection: "column", paddingBottom: 150 }}>
              <Typography variant="h6" paragraph>Currently, we don't have any healthy recipes for <i style={{ color: "red" }}><b>{inputSearch}</b></i></Typography>
              <Button style={{ backgroundColor: "#4a895a" }} size="lg" >
                <Link to="/addmore" style={{ color: "white" }} >Add your own recipes now!</Link>
              </Button>
            </div>
          </GridItem>
        </GridContainer>
      )
    }
  }

  const open = Boolean(anchorMs)

  let SnackBar = () => {
    if (likeWithoutLogin) {
      return (<SnackbarContent
        close
        message={<span>You have to log in to add this recipe to your favorite list!</span>}
        color="warning"
        icon={Warning}
      />)
    } else if (liked) {
      return (<SnackbarContent
        close
        message={<span>You have added this recipe to your favorite list!</span>}
        color="success"
        icon={Check}
      />)
    } else if (disliked) {
      return (<SnackbarContent
        close
        message={<span>You have removed this recipe from your favorite list!</span>}
        color="warning"
        icon={Warning}
      />)
    } else if (isDeleted) {
      return (<SnackbarContent
        close
        message={<span>You have deleted this recipe!</span>}
        color="danger"
        icon="info_outline"
      />)
    }
  }

  let RenderCard = () => {
    return (searchData.length === 0) ?
      <RenderNoResults />
      :
      cloneSearchData.map((data, idx) => {
        if (data.view_allowed) {
          return (
            <GridItem key={data.id} xs={12} sm={12} md={6} className={classes.navWrapper}>
              <Card className={classes.card}>
                <CardHeader
                  avatar={
                    <Tooltip
                      id={`avt-${data.id}`}
                      title={data.aurthor_name}
                      placement={window.innerWidth > 959 ? "top" : "left"}
                      classes={{ tooltip: classes.tooltip }}
                    >
                      <Avatar aria-label="Recipe" style={(data.aurthor_name.charAt(0) == "c") ? { backgroundColor: "red" } : (data.aurthor_name.charAt(0) == "h") ? { backgroundColor: "#4a895a" } : (data.aurthor_name.charAt(0) == "a") ? { backgroundColor: "black" } : { backgroundColor: "lightblue" }}>
                        {data.aurthor_name.charAt(0).toUpperCase()}
                      </Avatar>
                    </Tooltip>
                  }
                  action=
                  {(data.aurthor_name == name || data.is_admin === true)
                    &&
                    <>
                      <IconButton
                        aria-label="More"
                        aria-controls={`fade-menu-${data.id}`}
                        aria-haspopup="true"
                        onClick={e => handleClick(e, idx)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                      <Menu
                        id={`fade-menu-${data.id}`}
                        keepMounted
                        open={menuOpen[idx]}
                        onClose={handleClose}
                        anchorReference="anchorPosition"
                        anchorPosition={{ top: position.top, left: position.left }}
                        anchorOrigin={{
                          vertical: 'top',
                          horizontal: 'left',
                        }}
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'left',
                        }}
                      >
                        <Link style={{ color: "black" }}
                          to={{
                            pathname: `/edit/recipe/${data.id}`,
                            clearToken: props.location.clearToken,
                            state: {
                              isLogin,
                              data,
                              name,
                            }
                          }} >
                          <MenuItem>
                            Edit
                        </MenuItem>
                        </Link>
                        <MenuItem onClick={e => doubleFunctionDel(e, data.id)}>
                          Delete
                      </MenuItem>
                      </Menu>
                    </>
                  }
                  title={data.name.toUpperCase()}
                  subheader={moment(data.created_at).format('LLL')}
                />
                <CardMedia
                  className={newClasses.media}
                  image={data.img_url}
                  title={data.name}
                />
                <CardContent style={{ textAlign: "left", fontSize: "14px" }}>
                  <Typography variant="body2" color="textSecondary" component="p">
                    {data.tip}
                  </Typography>
                </CardContent>
                <CardActions disableSpacing>
                  <Tooltip
                    id={`fav-${data.id}`}
                    title={(data.is_liked) ? "Remove from favorites" : "Add to favorites"}
                    placement={window.innerWidth > 959 ? "top" : "left"}
                    classes={{ tooltip: classes.tooltip }}
                  >
                    <IconButton aria-label="Add to favorites" onClick={e => handleLikeClick(e, idx, data.id, data.name)}>
                      {(!isLogin) ? <FavoriteIcon /> : (data.is_liked) ? <FavoriteIcon style={{ color: "red" }} /> : <FavoriteIcon />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip
                    id={`share-${data.id}`}
                    title="Share"
                    placement={window.innerWidth > 959 ? "top" : "left"}
                    classes={{ tooltip: classes.tooltip }}
                  >
                    <IconButton aria-label="Share">
                      <ShareIcon />
                    </IconButton>
                  </Tooltip>
                  <IconButton
                    className={clsx(newClasses.expand, {
                      [newClasses.expandOpen]: cardExpanded[idx],
                    })}
                    onClick={() => handleExpandClick(idx)}
                    aria-expanded={cardExpanded[idx]}
                    aria-label="Show more"
                  >
                    <ExpandMoreIcon />
                  </IconButton>
                </CardActions>
                <Collapse in={cardExpanded[idx]} timeout="auto" unmountOnExit>
                  <CardContent>
                    <hr />
                    <Typography className="card-title">Ingredients:</Typography>
                    <Typography className="card-content">
                      {data.ingredient}
                    </Typography>
                    <hr />
                    <Typography className="card-title">Method:</Typography>
                    <Typography className="card-content" style={{ textAlign: "left" }}>
                      {data.method}
                    </Typography>
                    <hr />
                    <Typography className="card-title">Nutrition Facts:</Typography>
                    <Typography className="card-content" style={{ textAlign: "left" }}>
                      {data.nutrition}
                    </Typography>
                  </CardContent>
                </Collapse>
              </Card>
            </GridItem>
          )
        } else {
          return null
        }
      })
  }
  return (
    <div>
      <Header
        color="transparent"
        brand="Joy Foods"
        rightLinks={<HeaderLinks clearToken={props.location.clearToken} isLogin={isLogin} name={name} token={token} />}
        fixed
        changeColorOnScroll={{
          height: 200,
          color: "white"
        }}
        {...rest}
      />
      <Parallax small filter image={require("assets/img/replacement.jpg")} />
      <div className={classNames(classes.main, classes.mainRaised)}>
        <div>
          <div className={classes.container}>
            <div>
              <ScrollUpButton />
            </div>
            {(likeWithoutLogin === true || liked === true || disliked === true || isDeleted === true)
              &&
              <Popover
                open={open}
                anchorEl={anchorMs}
                onClose={handlePopClose}
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
                <SnackBar />
              </Popover>
            }
            <GridContainer justify="center">
              <GridItem xs={12} sm={12} md={8}>
                <div className="cardSearch">
                  <CustomInput
                    labelText="Search Here"
                    inputRootCustomClasses={classes.inputRootCustomClasses}
                    id="float"
                    formControlProps={{
                      className: classes.formControl,
                      fullWidth: true
                    }}
                    inputProps={{
                      inputProps: {
                        "aria-label": "Search",
                        autoFocus: true,
                        required: true,
                        className: classes.searchInput,
                        onChange: onSearchChange
                      }
                    }}
                  />
                </div>
              </GridItem>
            </GridContainer>
            <GridContainer justify="center">
              <RenderCard />
            </GridContainer>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

Replacement.propTypes = {
  classes: PropTypes.object
};

export default withStyles(profilePageStyle)(Replacement);
