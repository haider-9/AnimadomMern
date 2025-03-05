import SignUp from '../models/signup.model.js';

export const addUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const existingUser = await SignUp.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already in use' });
        }
        const newUser = new SignUp({
            name,
            email,
            password,
        });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await SignUp.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });

    }
}
  export const getUser = async (req, res) => {
      try {
          const { email } = req.params;
          const user = await SignUp.findOne({ email: email });
          if (!user) {
              return res.status(404).json({ message: "User not found" });
          }
          res.status(200).json(user);
      } catch (error) {
          console.error(error);
          res.status(500).json({ message: "Server error" });
      }
  }
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password } = req.body;
        const user = await SignUp.findByIdAndUpdate(id, { name, email, password }, { new: true });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}