// import React from "react";
// import { createStyles, makeStyles, Theme, ThemeProvider, createTheme } from "@material-ui/core/styles";
// import { Paper, Avatar, Typography } from "@material-ui/core";
// import { TextInput } from "./TextInput.js";
// import { MessageLeft, MessageRight } from "./Message";

// // Define the Material-UI theme
// const theme = createTheme({
//     palette: {
//         primary: {
//             main: "#3f51b5", // Customize the primary color here
//         },
//         secondary: {
//             main: "#f50057", // Customize the secondary color here
//         },
//     },
//     typography: {
//         fontFamily: "'Roboto', sans-serif", // Customize the font here
//     },
// });

// const useStyles = makeStyles((theme: Theme) =>
//     createStyles({
//         paper: {
//             width: "80vw",
//             height: "80vh",
//             maxWidth: "500px",
//             maxHeight: "700px",
//             display: "flex",
//             alignItems: "center",
//             flexDirection: "column",
//             position: "relative",
//         },
//         paper2: {
//             width: "80vw",
//             maxWidth: "500px",
//             display: "flex",
//             alignItems: "center",
//             flexDirection: "column",
//             position: "relative",
//         },
//         container: {
//             width: "100vw",
//             height: "100vh",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//         },
//         messagesBody: {
//             width: "calc( 100% - 20px )",
//             margin: 10,
//             overflowY: "scroll",
//             height: "calc( 100% - 80px )",
//         },
//         messageContainer: {
//             display: "flex",
//             alignItems: "center",
//             marginBottom: "10px",
//         },
//         avatar: {
//             marginRight: "10px",
//         },
//         messageContent: {
//             backgroundColor: "#f1f1f1",
//             padding: "10px",
//             borderRadius: "8px",
//             maxWidth: "80%",
//             wordWrap: "break-word",
//         },
//         name: {
//             fontWeight: "bold",
//         },
//         profileSection: {
//             display: "flex",
//             alignItems: "center",
//         },
//     })
// );

// export default function ChatBox() {
//     const classes = useStyles();
//     return (
//         <ThemeProvider theme={theme}>
//             <div className={classes.container}>
//                 <Paper className={classes.paper} elevation={2}>
//                     <Paper id="style-1" className={classes.messagesBody}>
//                         {/* Left Message */}
//                         <div className={classes.messageContainer}>
//                             <div className={classes.profileSection}>
//                                 <Avatar
//                                     className={classes.avatar}
//                                     alt="User Avatar"
//                                     src="https://lh3.googleusercontent.com/a-/AOh14Gi4vkKYlfrbJ0QLJTg_DLjcYyyK7fYoWRpz2r4s=s96-c"
//                                 />
//                                 <Typography variant="body2" className={classes.name}>
//                                     User 1
//                                 </Typography>
//                             </div>
//                             <div className={classes.messageContent}>
//                                 <MessageLeft
//                                     message="あめんぼあかいなあいうえお"
//                                     timestamp="MM/DD 00:00"
//                                     photoURL="https://lh3.googleusercontent.com/a-/AOh14Gi4vkKYlfrbJ0QLJTg_DLjcYyyK7fYoWRpz2r4s=s96-c"
//                                     displayName="User 1"
//                                     avatarDisp={true}
//                                 />
//                             </div>
//                         </div>

//                         {/* Right Message */}
//                         <div className={classes.messageContainer}>
//                             <div className={classes.profileSection}>
//                                 <Avatar
//                                     className={classes.avatar}
//                                     alt="User Avatar"
//                                     src="https://lh3.googleusercontent.com/a-/AOh14Gi4vkKYlfrbJ0QLJTg_DLjcYyyK7fYoWRpz2r4s=s96-c"
//                                 />
//                                 <Typography variant="body2" className={classes.name}>
//                                     User 2
//                                 </Typography>
//                             </div>
//                             <div className={classes.messageContent}>
//                                 <MessageRight
//                                     message="messageRあめんぼあかいなあいうえおあめんぼあかいなあいうえお"
//                                     timestamp="MM/DD 00:00"
//                                     photoURL="https://lh3.googleusercontent.com/a-/AOh14Gi4vkKYlfrbJ0QLJTg_DLjcYyyK7fYoWRpz2r4s=s96-c"
//                                     displayName="User 2"
//                                     avatarDisp={true}
//                                 />
//                             </div>
//                         </div>
//                     </Paper>
//                     <TextInput />
//                 </Paper>
//             </div>
//         </ThemeProvider>
//     );
// }
