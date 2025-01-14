import { Router, Request, Response } from 'express';

const router = Router();

// Public route: User profile
router.get('/profile', (req: Request, res: Response) => {
  res.json({
    message: 'User profile accessed successfully!',
    // Mocked user data
    user: {
      id: '12345',
      name: 'John Doe',
      email: 'johndoe@example.com',
      isCoach: false,
    },
  });
});

export default router;
