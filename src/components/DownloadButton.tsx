import { AiOutlineCloudDownload } from 'react-icons/ai';
import { DataInterface } from './DisplayData';

interface PropsInterface {
    data: DataInterface[];
}

const DownloadButton = ({ data }: PropsInterface) => {
    const headers = ['FirstName', 'LastName', 'Email', 'Role', 'Status', 'Login Data', 'Login Time'];
    const rows = data.map(item => [
        item.firstName, item.lastName, item.email, item.role, item.status, new Date(item.loginDate).toLocaleDateString(), item.loginTime
    ]);
    const csv = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');

    function handleDownload() {
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'data.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return (
        <button
            onClick={handleDownload}
            className="text-gray-500 mr-4 border shadow-md flex justify-center items-center rounded-lg p-2"
        >
            <AiOutlineCloudDownload fontSize={21} />
            <span>&nbsp; Download CSV</span>
        </button>
    );
};

export default DownloadButton;
