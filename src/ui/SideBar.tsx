import { IconButton, Tooltip } from '@mui/material';
import { CameraMode, useGameStore } from '../core/store/gameStore';
import PersonIcon from '@mui/icons-material/Person';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ThreeSixtyIcon from '@mui/icons-material/ThreeSixty';

export function SideBar() {
    const isMobile = useGameStore((state) => state.isMobile);

    const cameraMode = useGameStore((state) => state.cameraMode);
    const setCameraMode = useGameStore((state) => state.setCameraMode);

    const cycleCameraMode = () => {
        setCameraMode((cameraMode + 1) % 3);
    };

    const btnStyle = {
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        backdropFilter: 'blur(4px)',
        borderRadius: '8px',
        padding: isMobile ? '8px' : '10px',
        border: '1px solid rgba(255,255,255,0.1)',
        transition: 'all 0.2s ease',
        color: 'white',

        '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            borderColor: 'rgba(255,255,255,0.3)',
        },
    } as const;

    const iconBaseStyle = {
        fontSize: isMobile ? '20px' : '24px',
    };

    const cameraConfig = {
        [CameraMode.Follow]: {
            icon: <PersonIcon sx={iconBaseStyle} />,
            title: "Third Person"
        },
        [CameraMode.FPV]: {
            icon: <VisibilityIcon sx={iconBaseStyle} />,
            title: "First Person"
        },
        [CameraMode.Detached]: {
            icon: <ThreeSixtyIcon sx={iconBaseStyle} />,
            title: "Tripod View"
        },
    };
    const currentCamera = cameraConfig[cameraMode];

    return (
        <div style={{
            position: 'fixed',
            top: '10px',
            right: '10px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            pointerEvents: 'auto',
            zIndex: 50,
        }}>
            <Tooltip title="Exit" placement="left">
                <IconButton sx={btnStyle} onClick={() => window.location.reload()}>
                    <svg
                        viewBox="0 0 24 24"
                        width={isMobile ? 20 : 24}
                        height={isMobile ? 20 : 24}
                        fill="currentColor"
                    >
                        <path d="M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z" />
                    </svg>
                </IconButton>
            </Tooltip>

            <Tooltip title={currentCamera.title} placement="left">
                <IconButton sx={btnStyle} onClick={cycleCameraMode}>
                    {currentCamera.icon}
                </IconButton>
            </Tooltip>
        </div>
    );
}
