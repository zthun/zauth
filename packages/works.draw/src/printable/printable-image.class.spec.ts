/* eslint-disable require-jsdoc */
import { createMocked } from '@zthun/works.jest';
import { IZImageReader } from '../image/image-reader.interface';
import { ZPrintableImage } from './printable-image.class';

describe('ZPrintableImage', () => {
  let image: HTMLCanvasElement;
  let canvas: HTMLCanvasElement;
  let reader: jest.Mocked<IZImageReader>;

  function createTestTarget() {
    return new ZPrintableImage(reader);
  }

  beforeEach(() => {
    canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 200;

    jest.spyOn(canvas.getContext('2d'), 'drawImage');

    image = document.createElement('canvas');
    image.width = 15;
    image.height = 20;

    reader = createMocked<IZImageReader>(['read']);
    reader.read.mockResolvedValue(image);
  });

  describe('Import', () => {
    it('should load the image.', async () => {
      // Arrange
      const target = createTestTarget();
      // Act
      await target.import(new Blob());
      // Assert
      expect(target.width).toEqual(image.width);
      expect(target.height).toEqual(image.height);
    });

    it('should clear the image on a null import.', async () => {
      // Arrange
      const target = createTestTarget();
      // Act
      await target.import(null);
      // Assert
      expect(target.width).toEqual(1);
      expect(target.height).toEqual(1);
    });
  });

  describe('Print', () => {
    it('should stamp the image onto the canvas.', async () => {
      // Arrange
      const target = createTestTarget();
      const context = canvas.getContext('2d');
      await target.import(new Blob());
      // Act
      target.print(context);
      // Assert
      expect(context.drawImage).toHaveBeenCalledWith(image, 0, 0);
    });
  });
});
