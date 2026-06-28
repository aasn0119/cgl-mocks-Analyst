import { useRef, useState } from 'react';
import MockForm from '../components/MockForm';
import MockTable from '../components/MockTable';

const Mocks = () => {
    const [editingMock, setEditingMock] = useState(null);
    const formRef = useRef(null);

    const handleEdit = (mock) => {
        setEditingMock(mock);
        // Scroll to form smoothly
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const handleEditDone = () => {
        setEditingMock(null);
    };

    return (
        <div className="overflow-x-auto">
            <div ref={formRef}>
                <MockForm
                    editingMock={editingMock}
                    onEditDone={handleEditDone}
                />
            </div>
            <MockTable onEdit={handleEdit} />
        </div>
    );
};

export default Mocks;
