// import { useEffect, useState } from "react";
// import { useRouter } from "next/router";
// import axios from "axios";
// import {
//   Box,
//   Button,
//   Card,
//   CardContent,
//   Typography,
//   CircularProgress,
//   TextField,
//   List,
//   ListItem,
//   ListItemText,
//   Divider,
// } from "@mui/material";

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// export default function SavedGenerationsPage() {
//   const router = useRouter();
//   const [searchTerm, setSearchTerm] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [layouts, setLayouts] = useState<any[]>([]);

//   const fetchLayouts = async (query = "") => {
//     if (!API_BASE_URL) return;
//     setLoading(true);
//     try {
//       const res = await axios.get(`${API_BASE_URL}/generated_layouts/search?q=${query}`);
//       setLayouts(res.data);
//     } catch (err) {
//       console.error("Ошибка при загрузке генераций", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchLayouts();
//   }, []);

//   const groupedByTitle = layouts.reduce((acc, layout) => {
//     if (!acc[layout.title]) acc[layout.title] = [];
//     acc[layout.title].push(layout);
//     return acc;
//   }, {} as Record<string, any[]>);

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault();
//     fetchLayouts(searchTerm);
//   };

//   return (
//     <Box p={4}>
//       <Typography variant="h4" mb={4}>Сохранённые генерации</Typography>

//       <form onSubmit={handleSearch} style={{ marginBottom: 24 }}>
//         <TextField
//           fullWidth
//           label="Поиск по имени генерации"
//           variant="outlined"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//       </form>

//       {loading ? (
//         <Box display="flex" justifyContent="center" mt={4}>
//           <CircularProgress />
//         </Box>
//       ) : (
//         <List>
//           {Object.entries(groupedByTitle).map(([title, layouts]) => (
//             <Box key={title} mb={2}>
//               <Card variant="outlined">
//                 <CardContent>
//                   <ListItem
//                     button
//                     onClick={() => router.push(`/maketViewerSaved?title=${encodeURIComponent(title)}`)}
//                   >
//                     <ListItemText
//                       primary={title}
//                       secondary={`Создано: ${new Date(layouts[0].created_at).toLocaleString()} (${layouts.length} макетов)`}
//                     />
//                   </ListItem>
//                 </CardContent>
//               </Card>
//               <Divider />
//             </Box>
//           ))}
//         </List>
//       )}
//     </Box>
//   );
// } 
