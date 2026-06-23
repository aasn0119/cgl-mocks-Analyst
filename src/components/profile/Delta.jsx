import { C } from './constants';

const Delta = ({ val }) => {
    const up = val >= 0;

    return (
        <span
            style={{
                fontSize: 12,
                fontWeight: 600,
                color: up ? C.teal : C.red,
            }}
        >
            {up ? '↑ +' : '↓ '}
            {Math.abs(val).toFixed(1)}
        </span>
    );
};

export default Delta;
