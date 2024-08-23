import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { useDrag } from 'react-dnd';
import Icon from '../Icon';
import { StringNumber } from '../../types';
import DisplaySetMessageListTooltip from '../DisplaySetMessageListTooltip';
import Tooltip from '../Tooltip';

/**
 * Display a thumbnail for a display set.
 */
const Thumbnail = ({
  displaySetInstanceUID,
  className,
  imageSrc,
  imageAltText,
  description,
  seriesNumber,
  numInstances,
  loadingProgress,
  countIcon,
  messages,
  dragData = {},
  isActive,
  onClick,
  onDoubleClick,
  viewPreset = 'thumbnails',
  modality,
  isHydratedForDerivedDisplaySet = false,
  canReject = false,
  onReject = () => {},
  isTracked = false,
  onClickUntrack = () => {},
}): React.ReactNode => {
  // TODO: We should wrap our thumbnail to create a "DraggableThumbnail", as
  // this will still allow for "drag", even if there is no drop target for the
  // specified item.
  const [collectedProps, drag, dragPreview] = useDrag({
    type: 'displayset',
    item: { ...dragData },
    canDrag: function (monitor) {
      return Object.keys(dragData).length !== 0;
    },
  });

  const [lastTap, setLastTap] = useState(0);

  const handleTouchEnd = e => {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTap;
    if (tapLength < 300 && tapLength > 0) {
      onDoubleClick(e);
    } else {
      onClick(e);
    }
    setLastTap(currentTime);
  };

  const renderThumbnailPreset = () => {
    return (
      <>
        <div className="h-[132px] w-[132px]">
          <div className="relative">
            {imageSrc ? (
              <img
                src={imageSrc}
                alt={imageAltText}
                className="h-full w-full object-contain"
                crossOrigin="anonymous"
              />
            ) : (
              <div>{imageAltText}</div>
            )}

            <div className="text-muted-foreground absolute top-1 right-1 text-[12px]">
              {' '}
              {` ${numInstances}`}
            </div>
          </div>
        </div>
        <div className="flex h-[44px] w-[132px] items-center gap-[8px] pr-[4px] pl-[4px]">
          <div
            className={classnames(
              'h-[28px] w-[4px] rounded-[2px]',
              isActive ? 'bg-highlight' : 'bg-primary'
            )}
          ></div>
          <div className="text-[12px] text-white">{description}</div>
        </div>
      </>
    );
  };

  const renderListPreset = () => {
    return (
      <div className="flex h-full w-full items-center justify-between pr-[8px] pl-[8px] pt-[4px] pb-[4px]">
        <div className="relative flex h-[32px] items-center gap-[8px]">
          <div
            className={classnames(
              'h-[32px] w-[4px] rounded-[2px]',
              isActive || isHydratedForDerivedDisplaySet ? 'bg-highlight' : 'bg-primary/65',
              loadingProgress && loadingProgress < 1 && 'bg-primary/25'
            )}
          ></div>
          <div className="flex h-full flex-col">
            <div className="flex items-center gap-[7px]">
              <div className="text-[13px] text-white">{modality}</div>

              <div className="max-w-[160px] overflow-hidden overflow-ellipsis whitespace-nowrap text-[13px] text-white">
                {description}
              </div>
            </div>

            <div className="flex h-[12px] items-center gap-[7px] overflow-hidden">
              <div className="text-muted-foreground text-[12px]"> S:{seriesNumber}</div>
              <div className="text-muted-foreground text-[12px]">
                <div className="flex items-center gap-[4px]">
                  {' '}
                  {countIcon ? (
                    <Icon
                      name={countIcon}
                      className="w-3"
                    />
                  ) : (
                    <Icon
                      name={'info-series'}
                      className="w-3"
                    />
                  )}
                  <div>{numInstances}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex h-full items-center gap-[4px]">
          <DisplaySetMessageListTooltip
            messages={messages}
            id={`display-set-tooltip-${displaySetInstanceUID}`}
          />
          {canReject && (
            <Icon
              name="old-trash"
              className="h-[20px] w-[20px] text-red-500"
              onClick={onReject}
            />
          )}
          {isTracked && (
            <Tooltip
              position="right"
              content={
                <div className="flex flex-1 flex-row">
                  <div className="flex-2 flex items-center justify-center pr-4">
                    <Icon
                      name="info-link"
                      className="text-primary-active"
                    />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <span>
                      <span className="text-white">
                        {isTracked ? 'Series is tracked' : 'Series is untracked'}
                      </span>
                    </span>
                  </div>
                </div>
              }
            >
              <div className="group">
                <Icon
                  name="icon-status-tracking"
                  className="text-primary-light h-[20px] w-[20px] group-hover:hidden"
                />
                <Icon
                  name="cancel"
                  className="text-primary-light hidden h-[15px] w-[15px] group-hover:block"
                  onClick={onClickUntrack}
                />
              </div>
            </Tooltip>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      className={classnames(
        className,
        'bg-muted hover:bg-primary/30 flex cursor-pointer select-none flex-col outline-none',
        viewPreset === 'thumbnails' && 'h-[176px] w-[132px]',
        viewPreset === 'list' && 'h-[40px] w-[275px]'
      )}
      id={`thumbnail-${displaySetInstanceUID}`}
      data-cy={`study-browser-thumbnail`}
      data-series={seriesNumber}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onTouchEnd={handleTouchEnd}
      role="button"
      tabIndex="0"
    >
      <div
        ref={drag}
        className="h-full w-full"
      >
        {viewPreset === 'thumbnails' && renderThumbnailPreset()}
        {viewPreset === 'list' && renderListPreset()}
      </div>
    </div>
  );
};

Thumbnail.propTypes = {
  displaySetInstanceUID: PropTypes.string.isRequired,
  className: PropTypes.string,
  imageSrc: PropTypes.string,
  /**
   * Data the thumbnail should expose to a receiving drop target. Use a matching
   * `dragData.type` to identify which targets can receive this draggable item.
   * If this is not set, drag-n-drop will be disabled for this thumbnail.
   *
   * Ref: https://react-dnd.github.io/react-dnd/docs/api/use-drag#specification-object-members
   */
  dragData: PropTypes.shape({
    /** Must match the "type" a dropTarget expects */
    type: PropTypes.string.isRequired,
  }),
  imageAltText: PropTypes.string,
  description: PropTypes.string.isRequired,
  seriesNumber: StringNumber.isRequired,
  numInstances: PropTypes.number.isRequired,
  loadingProgress: PropTypes.number,
  messages: PropTypes.object,
  isActive: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  onDoubleClick: PropTypes.func.isRequired,
  viewPreset: PropTypes.string,
  modality: PropTypes.string,
  isHydratedForDerivedDisplaySet: PropTypes.bool,
  canReject: PropTypes.bool,
  onReject: PropTypes.func,
  isTracked: PropTypes.bool,
  onClickUntrack: PropTypes.func,
  countIcon: PropTypes.string,
};

export default Thumbnail;
