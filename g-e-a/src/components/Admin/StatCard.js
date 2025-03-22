import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

function StatCard({ title, value, change, icon }) {
    const isPositive = change > 0;

    return (
        <Card>
            <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            {title}
                        </Typography>
                        <Typography variant="h4" component="div" fontWeight="bold">
                            {value}
                        </Typography>
                        <Typography
                            variant="caption"
                            color={isPositive ? "success.main" : "error.main"}
                            sx={{ display: "flex", alignItems: "center" }}
                        >
                            {isPositive ? "+" : ""}
                            {change} from last month
                        </Typography>
                    </Box>
                    <Box sx={{ color: "primary.main" }}>{icon}</Box>
                </Box>
            </CardContent>
        </Card>
    );
}

export default StatCard;