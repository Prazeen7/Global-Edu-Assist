import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import { useTheme } from "@mui/material/styles";

const data = [
    {
        name: "Jan",
        institutions: 12,
        agents: 8,
        students: 20,
    },
    {
        name: "Feb",
        institutions: 15,
        agents: 10,
        students: 25,
    },
    {
        name: "Mar",
        institutions: 18,
        agents: 12,
        students: 30,
    },
    {
        name: "Apr",
        institutions: 22,
        agents: 15,
        students: 35,
    },
    {
        name: "May",
        institutions: 25,
        agents: 18,
        students: 40,
    },
    {
        name: "Jun",
        institutions: 30,
        agents: 20,
        students: 45,
    },
];

function OverviewChart() {
    const theme = useTheme();

    return (
        <Card>
            <CardHeader title="Overview" subheader="Platform activity for the past 30 days" />
            <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="institutions" name="Institutions" fill={theme.palette.primary.main} radius={[4, 4, 0, 0]} />
                        <Bar dataKey="agents" name="Agents" fill={theme.palette.primary.light} radius={[4, 4, 0, 0]} />
                        <Bar dataKey="students" name="Students" fill={theme.palette.primary.dark} radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}

export default OverviewChart;