import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
} from "@mui/material";

export interface DocumentsProps {
  CarData: {
    registrationPaperUrl?: string;
    certificateOfInspectionUrl?: string;
    insuranceUrl?: string;
    registrationPaperUriIsVerified?: boolean;
    registrationPaperIsVerified?: boolean;
    certificateOfInspectionUriIsVerified?: boolean;
    certificateOfInspectionIsVerified?: boolean;
    insuranceUriIsVerified?: boolean;
    insuranceIsVerified?: boolean;
    status?: string;
    booked?: boolean;
    [key: string]: any;
  };
}

const Documents: React.FC<DocumentsProps> = ({ CarData }) => {
  const role = localStorage.getItem("role");
  const documents = [
    {
      no: 1,
      name: "Registration Paper",
      uri: CarData.registrationPaperUrl,
      isVerified:
        CarData.registrationPaperUriIsVerified ||
        CarData.registrationPaperIsVerified,
    },
    {
      no: 2,
      name: "Certificate of Inspection",
      uri: CarData.certificateOfInspectionUrl,
      isVerified:
        CarData.certificateOfInspectionUriIsVerified ||
        CarData.certificateOfInspectionIsVerified,
    },
    {
      no: 3,
      name: "Insurance",
      uri: CarData.insuranceUrl,
      isVerified:
        CarData.insuranceUriIsVerified || CarData.insuranceIsVerified,
    },
  ];

  return (
    <TableContainer component={Paper} sx={{ mt: 2, width: "100%", p: 1 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>No</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Note</TableCell>
            {(role === "CAR_OWNER" || role === "OPERATOR") && (
              <TableCell>Link</TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {documents.map((doc, index) => (
            <TableRow
              key={doc.no}
              sx={{ backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff" }}
            >
              <TableCell>{doc.no}</TableCell>
              <TableCell>{doc.name}</TableCell>
              <TableCell>
                {CarData.status === "BOOKED" ? (
                  <a
                    href={doc.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#007BFF", textDecoration: "underline" }}
                  >
                    View Document
                  </a>
                ) : doc.isVerified ? (
                  "Verified"
                ) : (
                  "Not available"
                )}
              </TableCell>
              {(role === "CAR_OWNER" || role === "OPERATOR") && (
                <TableCell>
                  {doc.isVerified ? (
                    <a
                      href={doc.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#007BFF", textDecoration: "underline" }}
                    >
                      View Document
                    </a>
                  ) : (
                    "Not available"
                  )}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {CarData.booked !== true &&
        role !== "CAR_OWNER" &&
        role !== "OPERATOR" && (
          <Box
            sx={{
              mt: 2,
              p: 1,
              backgroundColor: "#FFF3CD",
              borderRadius: "8px",
              color: "#856404",
              textAlign: "center",
              fontSize: "10px",
            }}
          >
            Note: Documents will be available for viewing after you've paid the
            deposit to rent.
          </Box>
        )}
    </TableContainer>
  );
};

export default Documents;
