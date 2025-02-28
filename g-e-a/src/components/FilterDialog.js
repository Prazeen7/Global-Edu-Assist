import {
    Dialog,
    DialogContent,
    DialogTitle,
    Tabs,
    Tab,
    Stack,
    Box,
    Typography,
    Slider,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Card,
    CardContent,
    IconButton,
    FormControlLabel,
    Switch,
} from "@mui/material";
import { Remove as RemoveIcon, Add as AddIcon } from "@mui/icons-material";
import TabPanel from "./TabPanel";

export default function FilterDialog({ filterOpen, setFilterOpen, tabValue, handleTabChange, incomeSourceCount, setIncomeSourceCount }) {
    return (
        <Dialog open={filterOpen} onClose={() => setFilterOpen(false)} maxWidth="md" fullWidth scroll="paper">
            <DialogTitle>
                <Tabs value={tabValue} onChange={handleTabChange} centered>
                    <Tab label="Academic" />
                    <Tab label="Financial" />
                    <Tab label="Other" />
                </Tabs>
            </DialogTitle>
            <DialogContent dividers>
                <TabPanel value={tabValue} index={0}>
                    {/* Academic Content */}
                </TabPanel>
                <TabPanel value={tabValue} index={1}>
                    {/* Financial Content */}
                </TabPanel>
                <TabPanel value={tabValue} index={2}>
                    {/* Other Content */}
                </TabPanel>
            </DialogContent>
        </Dialog>
    );
}