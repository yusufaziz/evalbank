export const reportStyle = `<style>
body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
}
h1 {
    color: #333;
}
table {
    width: 100%;
    border-collapse: collapse;
    page-break-inside: auto; /* Allow table to split across pages */
}
th, td {
    border: 1px solid #000;
    padding: 8px;
    text-align: left;
    font-size: 13px;
}
thead {
    display: table-header-group; /* Repeat header on each page */
}
tbody {
    display: table-row-group;
}
tr {
    page-break-inside: avoid; /* Prevent rows from splitting across pages */
}
.report-cover, .report-summary {
    font-size: large;
    font-weight: bold;
    align-items: center;
    justify-content: center;
}
.report-cover span, .report-summary span {
    display: block;
    margin-bottom: 3px;
}
</style>`
