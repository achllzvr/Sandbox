import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { router } from '@inertiajs/react';

export default function GetStartedButton({
    className = '',
    variant = 'primary',
    block = false,
    size = '',
    label = 'Get Started',
}) {
    const [open, setOpen] = useState(false);
    const [menuStyle, setMenuStyle] = useState(null);
    const wrapRef = useRef(null);

    const updateMenuPosition = () => {
        if (!wrapRef.current) return;

        const rect = wrapRef.current.getBoundingClientRect();
        const menuWidth = block ? rect.width : Math.min(340, Math.max(280, rect.width));

        let left = block ? rect.left : rect.right - menuWidth;
        left = Math.max(12, Math.min(left, window.innerWidth - menuWidth - 12));

        setMenuStyle({
            top: rect.bottom + 10,
            left,
            width: menuWidth,
        });
    };

    useLayoutEffect(() => {
        if (!open) return undefined;
        updateMenuPosition();

        window.addEventListener('resize', updateMenuPosition);
        window.addEventListener('scroll', updateMenuPosition, true);

        return () => {
            window.removeEventListener('resize', updateMenuPosition);
            window.removeEventListener('scroll', updateMenuPosition, true);
        };
    }, [open, block]);

    useEffect(() => {
        if (!open) return undefined;

        const onPointerDown = (e) => {
            if (wrapRef.current?.contains(e.target)) return;
            if (e.target.closest?.('.get-started-menu')) return;
            setOpen(false);
        };

        const onKeyDown = (e) => {
            if (e.key === 'Escape') setOpen(false);
        };

        document.addEventListener('mousedown', onPointerDown);
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('mousedown', onPointerDown);
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [open]);

    const navigate = (routeName) => {
        setOpen(false);
        router.visit(route(routeName));
    };

    const btnClass = [
        'btn',
        `btn-${variant}`,
        block ? 'btn-block btn-lg' : '',
        size === 'nav' ? 'nav-btn' : '',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    const menu =
        open && menuStyle
            ? createPortal(
                  <div
                      className="get-started-menu"
                      role="menu"
                      aria-label="Choose account type"
                      style={{
                          top: `${menuStyle.top}px`,
                          left: `${menuStyle.left}px`,
                          width: `${menuStyle.width}px`,
                      }}
                  >
                      <p className="get-started-menu__title">Join as</p>
                      <div className="get-started-menu__options">
                          <button
                              type="button"
                              className="get-started-menu__option get-started-menu__option--primary"
                              role="menuitem"
                              onClick={() => navigate('register')}
                          >
                              <span className="get-started-menu__option-label">Student / Learner</span>
                              <span className="get-started-menu__option-desc">
                                  Browse certifications and earn credentials
                              </span>
                          </button>
                          <button
                              type="button"
                              className="get-started-menu__option get-started-menu__option--secondary"
                              role="menuitem"
                              onClick={() => navigate('register.teacher')}
                          >
                              <span className="get-started-menu__option-label">Educator / Affiliate</span>
                              <span className="get-started-menu__option-desc">
                                  Partner with Sandbox for your organization
                              </span>
                          </button>
                      </div>
                  </div>,
                  document.body,
              )
            : null;

    return (
        <>
            <div className={`get-started-wrap ${block ? 'get-started-wrap--block' : ''}`} ref={wrapRef}>
                <button
                    type="button"
                    className={btnClass}
                    aria-haspopup="menu"
                    aria-expanded={open}
                    onClick={() => setOpen((prev) => !prev)}
                >
                    {label}
                </button>
            </div>
            {menu}
        </>
    );
}
