import { useState } from "react"
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"
import Button from "../ui/Button"
import Input from "../ui/Input"
import Label from "../ui/Label"
import Card from "../ui/Card"
import Select from "../ui/Select"
import TermsModal from "../ui/TermsModal"
import { useDispatch } from "react-redux"
import { registerUser } from "../store/Slices/AuthSlice"
import { useNavigate } from "react-router-dom"

const SignupPage = () => {
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    prn: "",
    rollNo: "",
    password: "",
    role: "",
    branch: "",
    division: "",
    year: "",
  })

  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isTermsChecked, setIsTermsChecked] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const toggleShowPassword = () => setShowPassword(!showPassword)
  const toggleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword)

  const handleInputValue = (e) => {
    const { name, value } = e.target
    setSignupData({
      ...signupData,
      [name]: value,
    })
  }

  const handleSubmit = async(e) => {
    e.preventDefault()
    if (!isTermsChecked) {
      alert("Please agree to the Terms and Conditions to proceed.")
      return
    }
    console.log(signupData)
    const response = await dispatch(registerUser(signupData))
    if(response.payload.success){     
      navigate("/verify-email");
    }
  }

  const handleAgreeToTerms = () => {
    setIsTermsChecked(true)
    setIsModalOpen(false)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[550px] p-6" footerText="Already have an account?" linkText="Login" linkHref="/login">
        <h2 className="text-xl font-semibold mb-4 text-center">Sign Up</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="role">Role</Label>
              <Select
                id="role"
                name="role"
                value={signupData.role}
                onChange={handleInputValue}
                options={[
                  { value: "", label: "Specify Your role" },
                  { value: "student", label: "Student" },
                  { value: "teacher", label: "Teacher" },
                ]}
              />
            </div>
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                name="name"
                placeholder="Enter your name"
                value={signupData.name}
                onChange={handleInputValue}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={signupData.email}
              onChange={handleInputValue}
              required
            />
          </div>
          <div>
            <Label htmlFor="branch">Branch</Label>
            <Select
              id="branch"
              name="branch"
              value={signupData.branch}
              onChange={handleInputValue}
              options={[
                { value: "", label: "Select Branch" },
                { value: "CM", label: "Computer Engineering" },
                { value: "IT", label: "Information Technology" },
                { value: "ETC", label: "Electronics & Telecommunication" },
                { value: "AIDS", label: "AI & Data Science" },
              ]}
              required
            />
          </div>

          {signupData.role === "student" && (
            <>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <Label htmlFor="rollNo">Roll No.</Label>
                  <Input
                    id="rollNo"
                    type="text"
                    name="rollNo"
                    placeholder="Enter your Roll No."
                    value={signupData.rollNo}
                    onChange={handleInputValue}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="prn">PRN</Label>
                  <Input
                    id="prn"
                    type="text"
                    name="prn"
                    placeholder="Enter your PRN"
                    value={signupData.prn}
                    onChange={handleInputValue}
                    required
                  />
                </div>
                
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="division">Division</Label>
                  <Select
                    id="division"
                    name="division"
                    value={signupData.division}
                    onChange={handleInputValue}
                    options={[
                      { value: "", label: "Select Division" },
                      { value: "3", label: "3" },
                      { value: "4", label: "4" },
                      { value: "9", label: "9" },
                    ]}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="year">Year</Label>
                  <Select
                    id="year"
                    name="year"
                    value={signupData.year}
                    onChange={handleInputValue}
                    options={[
                      { value: "", label: "Select Year" },
                      { value: "FY", label: "First Year" },
                      { value: "SY", label: "Second Year" },
                      { value: "TY", label: "Third Year" },
                      { value: "LY", label: "Last Year" },
                    ]}
                    required
                  />
                </div>
              </div>
            </>
          )}

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="mb-4 relative">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={signupData.password}
                onChange={handleInputValue}
                required
              />
              <button type="button" onClick={toggleShowPassword} className="absolute top-10 right-2 flex items-center">
                {showPassword ? (
                  <EyeIcon className="h-5 w-5 text-gray-500" />
                ) : (
                  <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                )}
              </button>
            </div>

            <div className="mb-4 relative">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={toggleShowConfirmPassword}
                className="absolute top-10 right-2 flex items-center"
              >
                {showConfirmPassword ? (
                  <EyeIcon className="h-5 w-5 text-gray-500" />
                ) : (
                  <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="terms"
              checked={isTermsChecked}
              onChange={(e) => setIsTermsChecked(e.target.checked)}
              className="mr-2"
            />
            <Label htmlFor="terms">
              I agree to the{" "}
              <span onClick={() => setIsModalOpen(true)} className="text-primary hover:underline cursor-pointer">
                Terms and Conditions
              </span>
            </Label>
          </div>

          <Button type="submit" className="w-full mb-4">
            Sign Up
          </Button>
        </form>

        <TermsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAgree={handleAgreeToTerms} />
      </Card>
    </div>
  )
}

export default SignupPage

