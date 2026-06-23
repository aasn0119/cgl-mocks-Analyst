import { C } from './constants';

const ScorePill = ({ score }) => {
    const color = score >= 145 ? C.teal : score >= 130 ? C.amber : C.red;

    return (
        <span
            style={{
                display: 'inline-block',
                padding: '2px 10px',
                borderRadius: 99,
                fontSize: 12,
                fontWeight: 600,
                background: color + '22',
                color,
            }}
        >
            {score}
        </span>
    );
};

export default ScorePill;
