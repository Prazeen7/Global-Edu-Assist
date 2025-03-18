import React from "react"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import CardHeader from "@mui/material/CardHeader"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemAvatar from "@mui/material/ListItemAvatar"
import ListItemText from "@mui/material/ListItemText"
import Avatar from "@mui/material/Avatar"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"

const activities = [
    {
        id: 1,
        user: {
            name: "John Doe",
            email: "john@example.com",
            avatar: "/placeholder-user.jpg",
            initials: "JD",
        },
        action: "added a new institution",
        target: "University of Technology",
        time: "2 hours ago",
    },
    {
        id: 2,
        user: {
            name: "Sarah Johnson",
            email: "sarah@example.com",
            avatar: "/placeholder-user.jpg",
            initials: "SJ",
        },
        action: "approved document",
        target: "Student Visa Application",
        time: "3 hours ago",
    },
    {
        id: 3,
        user: {
            name: "Michael Brown",
            email: "michael@example.com",
            avatar: "/placeholder-user.jpg",
            initials: "MB",
        },
        action: "registered as an agent",
        target: "",
        time: "5 hours ago",
    },
    {
        id: 4,
        user: {
            name: "Emily Wilson",
            email: "emily@example.com",
            avatar: "/placeholder-user.jpg",
            initials: "EW",
        },
        action: "updated content on",
        target: "Landing Page",
        time: "1 day ago",
    },
    {
        id: 5,
        user: {
            name: "David Lee",
            email: "david@example.com",
            avatar: "/placeholder-user.jpg",
            initials: "DL",
        },
        action: "added new document template",
        target: "Scholarship Application",
        time: "1 day ago",
    },
]

function RecentActivity() {
    return (
        <Card>
            <CardHeader title="Recent Activity" subheader="Latest actions across the platform" />
            <CardContent>
                <List sx={{ width: "100%" }}>
                    {activities.map((activity) => (
                        <ListItem
                            key={activity.id}
                            alignItems="flex-start"
                            sx={{ px: 0, borderBottom: "1px solid", borderColor: "divider", "&:last-child": { border: "none" } }}
                        >
                            <ListItemAvatar>
                                <Avatar src={activity.user.avatar} alt={activity.user.name}>
                                    {activity.user.initials}
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={activity.user.name}
                                secondary={
                                    <React.Fragment>
                                        <Typography component="span" variant="body2" color="text.primary">
                                            {activity.action}{" "}
                                            {activity.target && (
                                                <Typography component="span" variant="body2" fontWeight="bold">
                                                    {activity.target}
                                                </Typography>
                                            )}
                                        </Typography>
                                    </React.Fragment>
                                }
                            />
                            <Box sx={{ color: "text.secondary", fontSize: "0.75rem" }}>{activity.time}</Box>
                        </ListItem>
                    ))}
                </List>
            </CardContent>
        </Card>
    )
}

export default RecentActivity

