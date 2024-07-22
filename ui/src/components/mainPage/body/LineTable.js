import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

const datas = [
    {id:1,name:"Enes",comingWith:2},
    {id:2,name:"Apo",comingWith:1},
]

export default function LineTable(){
    return (
        <TableContainer sx={{marginTop:5}}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{fontWeight:"bold"}}>Sıra</TableCell>
                        <TableCell align="center" sx={{fontWeight:"bold"}}>İsim</TableCell>
                        <TableCell align="center" sx={{fontWeight:"bold"}}>Kaç Kişi</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {datas.map((data) => (
                            <TableRow key={data.id}>
                                <TableCell>{data.id}</TableCell>
                                <TableCell align="center">{data.name}</TableCell>
                                <TableCell align="center">{data.comingWith}</TableCell>
                            </TableRow>
                    ))
                    }
                </TableBody>
            </Table>
        </TableContainer>
    )
}