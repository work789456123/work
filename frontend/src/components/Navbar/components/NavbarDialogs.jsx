import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authDialog, petDialog, navbarActions } from "@/assets/content/shared/auth_ui";

export function NavbarAuthDialog({
  open,
  onOpenChange,
  authMode,
  formData,
  onFieldChange,
  onToggleMode,
  onSubmit,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent id="navbar-dialog-auth" className="sm:max-w-md" data-testid="auth-dialog">
        <DialogHeader>
          <DialogTitle className="heading-font text-2xl">
            {authMode === "login" ? authDialog.loginTitle : authDialog.registerTitle}
          </DialogTitle>
        </DialogHeader>
        <form id="navbar-form-auth" onSubmit={onSubmit} className="space-y-4">
          {authMode === "register" && (
            <div>
              <Label htmlFor="navbar-auth-full_name">{authDialog.labels.fullName}</Label>
              <Input
                id="navbar-auth-full_name"
                data-testid="auth-fullname-input"
                value={formData.full_name}
                onChange={(e) => onFieldChange("full_name", e.target.value)}
                required
                className="rounded-lg border-[#EAEAEA]"
              />
            </div>
          )}
          <div>
            <Label htmlFor="navbar-auth-phone_or_email">{authDialog.labels.phoneOrEmail}</Label>
            <Input
              id="navbar-auth-phone_or_email"
              data-testid="auth-phone-email-input"
              value={formData.phone_or_email}
              onChange={(e) => onFieldChange("phone_or_email", e.target.value)}
              required
              className="rounded-lg border-[#EAEAEA]"
            />
          </div>
          <div>
            <Label htmlFor="navbar-auth-password">{authDialog.labels.password}</Label>
            <Input
              id="navbar-auth-password"
              type="password"
              data-testid="auth-password-input"
              value={formData.password}
              onChange={(e) => onFieldChange("password", e.target.value)}
              required
              className="rounded-lg border-[#EAEAEA]"
            />
          </div>
          <Button
            type="submit"
            data-testid="auth-submit-button"
            className="w-full rounded-full bg-[#1F6559] text-white hover:bg-[#184F46]"
          >
            {authMode === "login" ? authDialog.submitLogin : authDialog.submitRegister}
          </Button>
          <p className="text-center text-sm text-[#6F6F6F]">
            {authMode === "login" ? authDialog.toggleToRegister : authDialog.toggleToLogin}
            <button
              type="button"
              onClick={onToggleMode}
              className="text-[#1F6559] font-medium hover:underline"
              data-testid="auth-toggle-button"
            >
              {authMode === "login" ? authDialog.toggleSignUp : authDialog.toggleLogin}
            </button>
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function NavbarPetDialog({
  open,
  onOpenChange,
  petData,
  onFieldChange,
  onSubmit,
  onSkip,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent id="navbar-dialog-pet" className="sm:max-w-md" data-testid="add-pet-dialog">
        <DialogHeader>
          <DialogTitle className="heading-font text-2xl">{petDialog.title}</DialogTitle>
          <p className="text-sm text-[#6F6F6F]">{petDialog.subtitle}</p>
        </DialogHeader>
        <form id="navbar-form-pet" onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="navbar-pet-name">{petDialog.labels.name}</Label>
            <Input
              id="navbar-pet-name"
              data-testid="pet-name-input"
              value={petData.name}
              onChange={(e) => onFieldChange("name", e.target.value)}
              required
              className="rounded-lg border-[#EAEAEA]"
            />
          </div>
          <div>
            <Label htmlFor="navbar-pet-type">{petDialog.labels.type}</Label>
            <Input
              id="navbar-pet-type"
              data-testid="pet-type-input"
              placeholder={petDialog.labels.typePlaceholder}
              value={petData.pet_type}
              onChange={(e) => onFieldChange("pet_type", e.target.value)}
              required
              className="rounded-lg border-[#EAEAEA]"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label htmlFor="navbar-pet-age">{petDialog.labels.age}</Label>
              <Input
                id="navbar-pet-age"
                data-testid="pet-age-input"
                placeholder={petDialog.labels.agePlaceholder}
                value={petData.age}
                onChange={(e) => onFieldChange("age", e.target.value)}
                className="rounded-lg border-[#EAEAEA]"
              />
            </div>
            <div>
              <Label htmlFor="navbar-pet-gender">{petDialog.labels.gender}</Label>
              <Input
                id="navbar-pet-gender"
                data-testid="pet-gender-input"
                placeholder={petDialog.labels.genderPlaceholder}
                value={petData.gender}
                onChange={(e) => onFieldChange("gender", e.target.value)}
                className="rounded-lg border-[#EAEAEA]"
              />
            </div>
            <div>
              <Label htmlFor="navbar-pet-weight">{petDialog.labels.weight}</Label>
              <Input
                id="navbar-pet-weight"
                data-testid="pet-weight-input"
                placeholder={petDialog.labels.weightPlaceholder}
                value={petData.weight}
                onChange={(e) => onFieldChange("weight", e.target.value)}
                className="rounded-lg border-[#EAEAEA]"
              />
            </div>
          </div>
          <div className="flex space-x-3">
            <Button
              type="submit"
              data-testid="pet-submit-button"
              className="flex-1 rounded-full bg-[#1F6559] text-white hover:bg-[#184F46]"
            >
              {petDialog.submit}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onSkip}
              data-testid="pet-skip-button"
              className="flex-1 rounded-full border-[#EAEAEA]"
            >
              {petDialog.skip}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
