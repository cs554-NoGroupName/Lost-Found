import React from "react";
import {
    Typography,
    Grid,
    Divider,
    CardMedia
} from "@mui/material";
import LayoutProvider from "components/common/Layout";

const ErrorPage = ({ code, message }) => {
    return (
        <LayoutProvider>
            <Grid
                container
                sx={{
                    display: { xs: "block", sm: "flex", md: "flex", lg: "flex" },
                    alignItems: "center",
                    height: "100%",
                    backgroundColor: "rgba(0,0,0,0.1)",
                    borderRadius: "10px",
                    padding: "50px"
                }}
            >
                <Grid item xs={8}>
                    <Grid item xs={12}>
                        <Typography
                            sx={{
                                fontSize: "4rem",
                                color: "#000",
                                fontWeight: "bold"
                            }}>
                            Oops!
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography
                            sx={{
                                fontSize: { xs: "1rem", sm: "1.5rem", md: "2rem", lg: "2rem" },
                                color: "#000",
                                marginBottom: "30px"
                            }}>
                            We can't seem to find the page you are looking for.
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography
                            sx={{ fontSize: "1rem", color: "#000", fontWeight: "bold" }}>
                            Error code: {code}
                        </Typography>
                    </Grid>

                    <Divider
                        sx={{
                            backgroundColor: "#ff9717",
                            marginBottom: "10px",
                            marginTop: "10px"
                        }}
                    />

                    <Grid item xs={12}>
                        <Typography
                            sx={{ fontSize: "1rem", color: "#000", fontWeight: "bold" }}>
                            Error message: {message}
                        </Typography>
                    </Grid>

                    <Divider
                        sx={{
                            backgroundColor: "#ff9717",
                            marginBottom: "30px",
                            marginTop: "10px"
                        }}
                    />

                    <Grid item xs={12}>
                        <Typography
                            sx={{ fontSize: "1rem", color: "#000" }}>
                            Here are some helpful links instead:
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: "1rem",
                                '& a': {
                                    color: "#ff9717",
                                    textDecoration: "underline",
                                    fontWeight: "bold"
                                }
                            }}
                        >
                            <a href="/">Home</a>
                            <br />
                            <a href="/login">Login</a>
                        </Typography>
                    </Grid>
                </Grid>

                <Grid item xs={4}
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >
                    <CardMedia
                        component="img"
                        src="https://mlxwiptydqja.i.optimole.com/l7xVm6w-Q0Gu-GTt/w:1600/h:1270/q:mauto/https://www.septemberpeople.com/wp/wp-content/uploads/2019/10/fix-my-wordpress-website-error-warning-1600x1270.png"
                        alt="404"
                        sx={{
                            margin: "auto",
                            objectFit: "contain"
                        }}
                    />
                </Grid>

            </Grid>
        </LayoutProvider>
    );
};

export default ErrorPage;