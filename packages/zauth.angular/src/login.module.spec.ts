import { ZLoginModule } from './login.module';

describe('ZLoginModule', () => {
  function createTestTarget() {
    return new ZLoginModule();
  }

  it('should create.', () => {
    // Arrange
    // Act
    const target = createTestTarget();
    // Assert
    expect(target).toBeTruthy();
  });
});
