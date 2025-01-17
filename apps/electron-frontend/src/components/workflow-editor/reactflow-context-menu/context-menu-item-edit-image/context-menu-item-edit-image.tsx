import { NodeMenuProps } from "../types";
import { SDNode } from "@comflowy/common/comfui-interfaces";
import { GlobalEvents, SlotGlobalEvent } from "@comflowy/common/utils/slot-event";
/**
 * Context menu item to edit an image
 */
export function EditImageMenuItem(props: NodeMenuProps) {
  const node = props.node;
  if (!needEditImage(node)) {
    return null;
  }

  const image = node.fields?.image;
  const disabled = !image || image === "";

  return (
    <div className="context-menu-item-edit-image ">
      <div className="menu-item-title" style={{
        opacity: disabled ? 0.5 : 1
      }} onClick={ev => {
        if (disabled) {
          return;
        }
        SlotGlobalEvent.emit({
          type: GlobalEvents.open_image_editor,
          data: {
            id: props.id,
            image: node.fields?.image
          }
        })
        props.hide();
      }}><EditImageIcon /> Edit Image</div>

    </div>
  )
}

export function EditImageIcon(props: {
  className?: string,
  onClick?: () => void
}) {
  return (
    <svg onClick={props.onClick} className={props.className} width="18" height="18" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8.15528 19.6221C10.6162 22.083 13.7012 22.8389 15.1602 22.9883C15.7402 23.0762 16.1094 22.7685 16.1357 22.3203C16.1709 21.9072 15.916 21.5732 15.3975 21.4678C14.0703 21.248 11.3369 20.6064 9.2627 18.5146C5.89649 15.1572 5.22852 9.9453 8.00586 7.15917C10.2295 4.94432 13.9209 5.16405 16.6455 6.63182L17.7969 5.49803C14.2988 3.37108 9.65821 3.30077 6.90723 6.05174C3.62012 9.34764 4.00684 15.4736 8.15528 19.6221ZM21.5147 6.86913L22.2617 6.11327C22.6484 5.71776 22.6836 5.14647 22.2969 4.77733L22.0332 4.52245C21.6904 4.20604 21.1367 4.23241 20.7588 4.60155L20.0029 5.35741L21.5147 6.86913ZM12.9277 15.4473L20.8643 7.51952L19.3438 6.0078L11.416 13.9355L10.6514 15.7812C10.5547 16.0273 10.8008 16.2646 11.0381 16.1767L12.9277 15.4473ZM11.4951 16.9414C14.2988 19.8594 19.124 20.9492 21.7607 18.3213C23.9053 16.168 23.7207 12.3447 21.3828 9.04003L20.2578 10.165C21.9805 12.7051 22.2969 15.5703 20.6533 17.2139C18.6318 19.2353 15.3359 18.3213 13.1826 16.2646L11.4951 16.9414Z" fill="white" />
    </svg>
  )
}

export function needEditImage(node: SDNode): boolean {
  if (node.widget === "LoadImage") {
    return true;
  }
  return false;
}
