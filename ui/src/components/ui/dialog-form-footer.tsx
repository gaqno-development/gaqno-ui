import { Button } from './button'
import { DialogFooter } from './dialog'

interface IDialogFormFooterProps {
  onCancel: () => void
  isSubmitting: boolean
  submitLabel?: string
  cancelLabel?: string
  isEdit?: boolean
}

export function DialogFormFooter({
  onCancel,
  isSubmitting,
  submitLabel,
  cancelLabel = 'Cancelar',
  isEdit = false,
}: IDialogFormFooterProps) {
  const defaultSubmitLabel = isEdit ? 'Atualizar' : 'Criar'
  const finalSubmitLabel = submitLabel || defaultSubmitLabel

  return (
    <DialogFooter>
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isSubmitting}
      >
        {cancelLabel}
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Salvando...' : finalSubmitLabel}
      </Button>
    </DialogFooter>
  )
}

